import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const agentId = params.id;
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Supabase not configured');
    }
    
    // Fetch reviews for this agent
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/reviews?agent_id=eq.${agentId}&select=created_at,score,wallet_id&order=created_at.desc`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );
    
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Supabase error: ${res.status} - ${text}`);
    }
    
    const reviews = await res.json();
    
    // Transform to required format
    const history = reviews.map((review: any) => ({
      date: review.created_at,
      score: review.score,
      reviewer: review.wallet_id,
    }));
    
    return NextResponse.json(history);
  } catch (error: any) {
    console.error('Reputation History API Error:', error);
    return NextResponse.json({ 
      error: error.message,
    }, { status: 500 });
  }
}
