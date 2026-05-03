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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const category = searchParams.get('category');
    
    let query = 'agents?select=*';
    
    if (q) {
      query += `&name=ilike.*${q}*`;
    }
    
    if (category && category !== 'all') {
      query += `&category=eq.${category}`;
    }
    
    const agents = await supabaseRequest(query);
    
    // Get review counts for each agent
    const agentsWithReviews = await Promise.all(
      agents.map(async (agent: any) => {
        const reviews = await supabaseRequest('reviews?agent_id=eq.' + agent.id + '&select=score');
        const avgScore = reviews.length > 0 
          ? reviews.reduce((sum: number, r: any) => sum + r.score, 0) / reviews.length 
          : null;
        
        // Reputation: 0-100 scale based on average (5-star max = 100)
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
    
    return NextResponse.json(agentsWithReviews);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: error.message,
      urlConfigured: !!SUPABASE_URL,
      keyConfigured: !!SUPABASE_ANON_KEY
    }, { status: 500 });
  }
}
