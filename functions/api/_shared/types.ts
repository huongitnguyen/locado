/// <reference types="@cloudflare/workers-types" />

// Cloudflare Pages Function environment
export interface Env {
  GITHUB_OWNER: string;
  GITHUB_REPO: string;
  CACHE_TTL_SECONDS: string;
  ALLOWED_ORIGINS: string;
  STATS_KV?: KVNamespace;
}

// GitHub API types
export interface GitHubAsset {
  name: string;
  download_count: number;
  size: number;
  browser_download_url: string;
}

export interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  prerelease: boolean;
  body: string;
  html_url: string;
  assets: GitHubAsset[];
}

// Platform types
export type Platform = 
  | 'darwin-arm64' 
  | 'darwin-amd64' 
  | 'linux-arm64' 
  | 'linux-amd64' 
  | 'windows-amd64';

// API Response types
export interface DownloadStats {
  total: number;
  byVersion: Record<string, number>;
  byPlatform: Record<Platform, number>;
  collectedAt: number;
}

export interface ReleaseItem {
  version: string;
  name: string;
  date: string;
  changes: string[];
  url: string;
  downloads: number;
}

export interface ReleasesResponse {
  releases: ReleaseItem[];
  collectedAt: number;
}

// Trends API types (Phase 5)
export interface TrendsResponse {
  current: number;
  weekAgo: number;
  monthAgo: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
  daily: Array<{ date: string; total: number }>;
}

export interface StatsSnapshot {
  total: number;
  byVersion: Record<string, number>;
  byPlatform: Record<Platform, number>;
  collectedAt: number;
}

// API Error Response type
export interface ApiErrorResponse {
  error: string;
  code: 'RATE_LIMITED' | 'GITHUB_ERROR' | 'INTERNAL_ERROR';
  retryAfter?: number; // seconds until retry
  details?: string;
}

// Stale data indicator for fallback responses
export interface StaleIndicator {
  isStale?: boolean;
  staleAt?: number;
  originalError?: string;
}

// Response types with stale indicator support
export interface DownloadStatsResponse extends DownloadStats, StaleIndicator {}
export interface ReleasesResponseWithStale extends ReleasesResponse, StaleIndicator {}
