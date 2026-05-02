import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

async function supabaseRequest(endpoint: string, options: RequestInit = {}) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase not configured');
  }
  
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
    ...options,
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase error: ${res.status} - ${text}`);
  }
  
  return res.json();
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id;
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Supabase not configured');
    }
    
    // Fetch agent by id
    const agents = await supabaseRequest(`agents?id=eq.${agentId}&select=*`);
    
    if (agents.length === 0) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }
    
    const agent = agents[0];
    
    // Fetch reviews for this agent
    const reviews = await supabaseRequest(
      `reviews?agent_id=eq.${agentId}&select=id,score,comment,reviewer_wallet_id`
    );
    
    // Calculate average score and reputation
    const avgScore = reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.score, 0) / reviews.length
      : null;
    
    // Reputation: 0-100 scale based on average (5-star max = 100)
    const reputationScore = avgScore ? Math.round(avgScore * 20) : 0;
    
    return NextResponse.json({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      category: agent.category,
      near_wallet_id: agent.near_wallet_id,
      owner_wallet_id: agent.owner_wallet_id,
      is_verified: agent.is_verified || false,
      average_score: avgScore ? Math.round(avgScore * 10) / 10 : null,
      review_count: reviews.length,
      reputation_score: reputationScore,
      reviews: reviews.map((r: any) => ({
        id: r.id,
        score: r.score,
        comment: r.comment,
        reviewer_wallet_id: r.reviewer_wallet_id,
      })),
    });
  } catch (error: any) {
    console.error('Agent API Error:', error);
    return NextResponse.json({ 
      error: error.message,
    }, { status: 500 });
  }
}
