/// <reference types="@cloudflare/workers-types" />
import type { Env, GitHubRelease, Platform } from './types';

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Fetch releases from GitHub API with Cloudflare Cache API
 */
export async function fetchReleasesWithCache(
  env: Env,
  request: Request,
  waitUntil: (promise: Promise<unknown>) => void
): Promise<GitHubRelease[]> {
  // @ts-expect-error - Cloudflare Workers runtime has caches.default
  const cache = caches.default as Cache;
  const ttl = parseInt(env.CACHE_TTL_SECONDS || '120');
  
  // Create cache key based on repo
  const cacheKey = new Request(
    `https://cache.locado.hxd.app/github-releases/${env.GITHUB_OWNER}/${env.GITHUB_REPO}`
  );

  // Check cache first
  const cached = await cache.match(cacheKey);
  if (cached) {
    return cached.json();
  }

  // Fetch from GitHub API
  const url = `${GITHUB_API_BASE}/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/releases?per_page=100`;
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Locado-Landing-Stats'
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const data: GitHubRelease[] = await response.json();

  // Cache the response
  const cacheResponse = new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${ttl}`
    }
  });
  
  // Non-blocking cache write
  waitUntil(cache.put(cacheKey, cacheResponse));

  return data;
}

/**
 * Extract platform from asset filename
 * Handles both CLI and Desktop app naming patterns
 */
export function extractPlatform(filename: string): Platform | null {
  const patterns: [RegExp, Platform][] = [
    // CLI patterns: locado-darwin-arm64.tar.gz
    [/darwin-arm64/i, 'darwin-arm64'],
    [/darwin-amd64|darwin-x64/i, 'darwin-amd64'],
    [/linux-arm64/i, 'linux-arm64'],
    [/linux-amd64|linux-x64/i, 'linux-amd64'],
    [/windows-amd64|windows-x64|win-x64/i, 'windows-amd64'],
    // Desktop patterns: Locado-Desktop-macos-universal.dmg
    [/macos-arm64/i, 'darwin-arm64'],
    [/macos-universal|macos-x64/i, 'darwin-amd64'],
    [/windows.*\.exe|\.msi/i, 'windows-amd64'],
  ];

  for (const [regex, platform] of patterns) {
    if (regex.test(filename)) return platform;
  }
  return null;
}

/**
 * Get CORS headers based on request origin
 */
export function getCorsHeaders(request: Request, env: Env): Record<string, string> {
  const origin = request.headers.get('Origin') || '';
  const allowedOrigins = env.ALLOWED_ORIGINS?.split(',') || ['https://locado.hxd.app'];
  
  // Check if origin is allowed
  const isAllowed = allowedOrigins.some(allowed => 
    origin === allowed.trim() || allowed.trim() === '*'
  );
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };
}

/**
 * Parse changelog from release body
 */
export function parseChangelog(body: string | null): string[] {
  if (!body) return ['Bug fixes and improvements'];
  
  const lines = body.split('\n');
  const changes: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Extract bullet points starting with "- " but exclude table rows
    if (trimmed.startsWith('- ') && !trimmed.includes('|')) {
      changes.push(trimmed.substring(2));
    }
  }

  return changes.length > 0 ? changes : ['Bug fixes and improvements'];
}
