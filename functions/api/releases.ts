/// <reference types="@cloudflare/workers-types" />
import type { Env, ReleasesResponse, ReleasesResponseWithStale } from './_shared/types';
import { fetchReleasesWithCache, getCorsHeaders, parseChangelog, GitHubRateLimitError, saveToKV, loadFromKV, KV_RELEASES_KEY } from './_shared/github';
import { FALLBACK_RELEASES } from './_shared/fallback-data';

// Handle CORS preflight
export const onRequestOptions: PagesFunction<Env> = async ({ request, env }) => {
  return new Response(null, {
    headers: getCorsHeaders(request, env)
  });
};

// GET /api/releases
export const onRequestGet: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  const corsHeaders = getCorsHeaders(request, env);

  try {
    const releases = await fetchReleasesWithCache(env, request, waitUntil);

    const response: ReleasesResponse = {
      releases: releases.slice(0, 10).map(release => {
        const downloads = release.assets.reduce(
          (sum, asset) => sum + asset.download_count,
          0
        );

        return {
          version: release.tag_name,
          name: release.name || release.tag_name,
          date: new Date(release.published_at).toISOString().split('T')[0],
          changes: parseChangelog(release.body),
          url: release.html_url,
          downloads
        };
      }),
      collectedAt: Date.now()
    };

    // Save to KV for fallback (non-blocking)
    waitUntil(saveToKV(env.STATS_KV, KV_RELEASES_KEY, response));

    return new Response(JSON.stringify(response), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=120'
      }
    });
  } catch (error) {
    console.error('Failed to fetch releases:', error);

    // Try KV cache first (stale data is better than error)
    const cached = await loadFromKV<ReleasesResponse>(env.STATS_KV, KV_RELEASES_KEY);
    if (cached) {
      const staleResponse: ReleasesResponseWithStale = {
        ...cached.data,
        isStale: true,
        staleAt: cached.savedAt
      };
      return new Response(JSON.stringify(staleResponse), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Final fallback - static data
    const fallbackResponse: ReleasesResponseWithStale = {
      ...FALLBACK_RELEASES,
      collectedAt: Date.now(),
      isStale: true,
      staleAt: 0
    };
    return new Response(JSON.stringify(fallbackResponse), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};
