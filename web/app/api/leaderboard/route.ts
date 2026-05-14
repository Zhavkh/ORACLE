import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function supabaseRequest(endpoint: string) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase not configured');
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase error: ${res.status} - ${text}`);
  }

  return res.json();
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const agents = await supabaseRequest('agents?select=*');

    const agentsWithData = await Promise.all(
      agents.map(async (agent: any) => {
        const reviews = await supabaseRequest(`reviews?agent_id=eq.${agent.id}&select=score`);
        const avgScore = reviews.length > 0
          ? reviews.reduce((sum: number, r: any) => sum + r.score, 0) / reviews.length
          : null;
        const reputationScore = avgScore ? Math.round(avgScore * 20) : 0;

        return {
          id: agent.id,
          name: agent.name,
          description: agent.description,
          near_wallet_id: agent.near_wallet_id,
          owner_wallet_id: agent.owner_wallet_id,
          category: agent.category,
          average_score: avgScore ? Math.round(avgScore * 10) / 10 : null,
          reputation_score: reputationScore,
          is_verified: agent.is_verified || false,
          review_count: reviews.length,
        };
      })
    );

    const sorted = agentsWithData
      .sort((a: any, b: any) => {
        if (b.review_count !== a.review_count) return b.review_count - a.review_count;
        return (b.average_score || 0) - (a.average_score || 0);
      })
      .slice(0, limit);

    return NextResponse.json(sorted);
  } catch (error: any) {
    console.error('Leaderboard API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
