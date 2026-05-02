import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

async function supabaseRequest(endpoint: string) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(`Supabase not configured: URL=${!!SUPABASE_URL}, KEY=${!!SUPABASE_ANON_KEY}`);
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

export async function GET() {
  try {
    const [agents, reviews] = await Promise.all([
      supabaseRequest('agents?select=id,is_verified'),
      supabaseRequest('reviews?select=score'),
    ]);
    
    const totalAgents = agents.length;
    const verifiedAgents = agents.filter((a: any) => a.is_verified).length;
    const totalReviews = reviews.length;
    
    const avgRating = totalReviews > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.score, 0) / totalReviews
      : 0;
    
    return NextResponse.json({
      total_agents: totalAgents,
      total_reviews: totalReviews,
      verified_agents: verifiedAgents,
      average_rating: Math.round(avgRating * 10) / 10,
    });
  } catch (error: any) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ 
      error: error.message,
      urlConfigured: !!SUPABASE_URL,
      keyConfigured: !!SUPABASE_ANON_KEY
    }, { status: 500 });
  }
}
