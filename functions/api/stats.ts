/// <reference types="@cloudflare/workers-types" />
import type { Env, DownloadStats, Platform } from './_shared/types';
import { fetchReleasesWithCache, extractPlatform, getCorsHeaders } from './_shared/github';

// Handle CORS preflight
export const onRequestOptions: PagesFunction<Env> = async ({ request, env }) => {
  return new Response(null, { 
    headers: getCorsHeaders(request, env) 
  });
};

// GET /api/stats
export const onRequestGet: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  const corsHeaders = getCorsHeaders(request, env);

  try {
    const releases = await fetchReleasesWithCache(env, request, waitUntil);

    const stats: DownloadStats = {
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

    return new Response(JSON.stringify(stats), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=120'
      }
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch stats' }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};
