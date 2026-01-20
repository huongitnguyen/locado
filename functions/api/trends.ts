/// <reference types="@cloudflare/workers-types" />
import type { Env, TrendsResponse, StatsSnapshot } from './_shared/types';
import { getCorsHeaders } from './_shared/github';

// Handle CORS preflight
export const onRequestOptions: PagesFunction<Env> = async ({ request, env }) => {
  return new Response(null, { 
    headers: getCorsHeaders(request, env) 
  });
};

// GET /api/trends - Returns historical download trends
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const corsHeaders = getCorsHeaders(request, env);

  // Check if KV is configured
  if (!env.STATS_KV) {
    return new Response(
      JSON.stringify({ 
        error: 'Trends data not available',
        message: 'KV namespace not configured. Enable Phase 5 for historical trends.'
      }), 
      {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    // Get latest snapshot
    const latest = await env.STATS_KV.get('stats:latest', 'json') as StatsSnapshot | null;
    
    if (!latest) {
      return new Response(
        JSON.stringify({ 
          error: 'No historical data available',
          message: 'Trends data will be available after the first scheduled collection.'
        }), 
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Calculate dates
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    const monthAgo = new Date(now.getTime() - 30 * 86400000);

    // Get historical snapshots
    const weekAgoData = await env.STATS_KV.get(
      `stats:daily:${weekAgo.toISOString().split('T')[0]}`,
      'json'
    ) as StatsSnapshot | null;

    const monthAgoData = await env.STATS_KV.get(
      `stats:daily:${monthAgo.toISOString().split('T')[0]}`,
      'json'
    ) as StatsSnapshot | null;

    // Calculate growth percentages
    const weeklyGrowth = weekAgoData && weekAgoData.total > 0
      ? ((latest.total - weekAgoData.total) / weekAgoData.total) * 100 
      : 0;
    
    const monthlyGrowth = monthAgoData && monthAgoData.total > 0
      ? ((latest.total - monthAgoData.total) / monthAgoData.total) * 100 
      : 0;

    // Get last 30 days for chart data
    const dailyData: Array<{ date: string; total: number }> = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 86400000);
      const dateStr = date.toISOString().split('T')[0];
      const data = await env.STATS_KV.get(`stats:daily:${dateStr}`, 'json') as StatsSnapshot | null;
      
      if (data) {
        dailyData.push({ date: dateStr, total: data.total });
      }
    }

    const response: TrendsResponse = {
      current: latest.total,
      weekAgo: weekAgoData?.total || 0,
      monthAgo: monthAgoData?.total || 0,
      weeklyGrowth: Math.round(weeklyGrowth * 10) / 10,
      monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
      daily: dailyData
    };

    return new Response(JSON.stringify(response), {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // 5 min cache for trends
      }
    });
  } catch (error) {
    console.error('Failed to fetch trends:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch trends data' }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};
