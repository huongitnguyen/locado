/// <reference types="@cloudflare/workers-types" />
import type { DownloadStats, ReleasesResponse } from './types';

/**
 * Static fallback data used when both GitHub API and KV cache fail
 * Returns minimal data to keep the frontend functional
 */

export const FALLBACK_STATS: DownloadStats = {
  total: 0,
  byVersion: {},
  byPlatform: {
    'darwin-arm64': 0,
    'darwin-amd64': 0,
    'linux-arm64': 0,
    'linux-amd64': 0,
    'windows-amd64': 0
  },
  collectedAt: 0
};

export const FALLBACK_RELEASES: ReleasesResponse = {
  releases: [{
    version: 'v1.0.0',
    name: 'Initial Release',
    date: '2026-01-01',
    changes: ['First public release'],
    url: 'https://github.com/xuandung38/locado/releases',
    downloads: 0
  }],
  collectedAt: 0
};
