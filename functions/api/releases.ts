/// <reference types="@cloudflare/workers-types" />
import type { Env, ReleasesResponse } from './_shared/types';
import { fetchReleasesWithCache, getCorsHeaders, parseChangelog } from './_shared/github';

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

    return new Response(JSON.stringify(response), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=120'
      }
    });
  } catch (error) {
    console.error('Failed to fetch releases:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch releases' }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};
