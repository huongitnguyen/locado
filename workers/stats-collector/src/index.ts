/**
 * Scheduled Worker for collecting GitHub download statistics
 * Runs every 6 hours to store snapshots in KV for trend analysis
 */

interface Env {
  STATS_KV: KVNamespace;
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
}

interface GitHubAsset {
  name: string;
  download_count: number;
}

interface GitHubRelease {
  tag_name: string;
  assets: GitHubAsset[];
}

type Platform = 'darwin-arm64' | 'darwin-amd64' | 'linux-arm64' | 'linux-amd64' | 'windows-amd64';

interface StatsSnapshot {
  total: number;
  byVersion: Record<string, number>;
  byPlatform: Record<Platform, number>;
  collectedAt: number;
}

export default {
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    console.log(`Stats collection triggered at ${new Date().toISOString()}`);
    
    try {
      const stats = await collectStats(env);
      
      const timestamp = Date.now();
      const dateKey = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Store timestamped snapshot (30-day retention)
      await env.STATS_KV.put(
        `stats:${timestamp}`,
        JSON.stringify(stats),
        { expirationTtl: 86400 * 30 } // 30 days
      );
      
      // Update latest pointer (no expiration)
      await env.STATS_KV.put('stats:latest', JSON.stringify(stats));
      
      // Store/update daily aggregate (90-day retention)
      const dailyKey = `stats:daily:${dateKey}`;
      const existing = await env.STATS_KV.get(dailyKey, 'json') as StatsSnapshot | null;
      
      // Only update if new total is higher (downloads only go up)
      if (!existing || stats.total > existing.total) {
        await env.STATS_KV.put(dailyKey, JSON.stringify(stats), {
          expirationTtl: 86400 * 90 // 90 days retention for daily
        });
      }
      
      console.log(`Stats collected successfully: ${stats.total} total downloads`);
      
    } catch (error) {
      console.error('Failed to collect stats:', error);
      throw error; // Re-throw to mark the scheduled event as failed
    }
  }
};

async function collectStats(env: Env): Promise<StatsSnapshot> {
  const url = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/releases?per_page=100`;
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Locado-Stats-Collector'
    }
  });
  
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  
  const releases: GitHubRelease[] = await response.json();
  
  const stats: StatsSnapshot = {
    total: 0,
    byVersion: {},
    byPlatform: {
      'darwin-arm64': 0,
      'darwin-amd64': 0,
      'linux-arm64': 0,
      'linux-amd64': 0,
      'windows-amd64': 0
    },
    collectedAt: Date.now()
  };
  
  for (const release of releases) {
    let versionTotal = 0;
    
    for (const asset of release.assets) {
      const platform = extractPlatform(asset.name);
      if (platform) {
        stats.byPlatform[platform] += asset.download_count;
        stats.total += asset.download_count;
        versionTotal += asset.download_count;
      }
    }
    
    if (versionTotal > 0) {
      stats.byVersion[release.tag_name] = versionTotal;
    }
  }
  
  return stats;
}

function extractPlatform(filename: string): Platform | null {
  const patterns: [RegExp, Platform][] = [
    [/darwin-arm64|macos-arm64/i, 'darwin-arm64'],
    [/darwin-amd64|darwin-x64|macos-x64|macos-universal/i, 'darwin-amd64'],
    [/linux-arm64/i, 'linux-arm64'],
    [/linux-amd64|linux-x64/i, 'linux-amd64'],
    [/windows-amd64|windows-x64|win-x64/i, 'windows-amd64'],
  ];
  
  for (const [regex, platform] of patterns) {
    if (regex.test(filename)) return platform;
  }
  return null;
}
