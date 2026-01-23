/// <reference types="@cloudflare/workers-types" />
import type { Env, ReleasesResponse, ApiErrorResponse } from './_shared/types';
import { fetchReleasesWithCache, getCorsHeaders, parseChangelog, GitHubRateLimitError } from './_shared/github';

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

    // Handle rate limit error with 429 status
    if (error instanceof GitHubRateLimitError) {
      const retryAfter = error.getRetryAfter();
      const errorResponse: ApiErrorResponse = {
        error: 'Rate limit exceeded',
        code: 'RATE_LIMITED',
        retryAfter
      };
      return new Response(JSON.stringify(errorResponse), {
        status: 429,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter)
        }
      });
    }

    // Handle other GitHub/fetch errors with 503
    // Only expose error details in development (not on production origin)
    const isDev = !request.url.includes('locado.hxd.app');
    const errorResponse: ApiErrorResponse = {
      error: 'Service temporarily unavailable',
      code: 'GITHUB_ERROR',
      ...(isDev && { details: error instanceof Error ? error.message : 'Unknown error' })
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};
