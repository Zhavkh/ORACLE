import { NextRequest, NextResponse } from "next/server";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const ADMIN_PASSWORD = "10399s_134f#$%%4**11zls0091ksdz1)55";

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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verify admin password
    const adminPassword = request.headers.get("X-Admin-Password");
    if (adminPassword !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !["approved", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get agent details before updating
    const agentRes = await supabaseRequest(`agents?id=eq.${params.id}&select=*`);
    if (!agentRes || agentRes.length === 0) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const agent = agentRes[0];

    // Update agent status
    const updateRes = await supabaseRequest(`agents?id=eq.${params.id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    if (!updateRes || updateRes.length === 0) {
      return NextResponse.json({ error: "Failed to update agent" }, { status: 500 });
    }

    // Send email notifications
    try {
      // Notify admin
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: "kolofridrih@gmail.com",
          subject: `Agent ${status}: ${agent.name}`,
          text: `Agent ${agent.name} by ${agent.owner_wallet_id} has been ${status}.`,
        }),
      });

      // Notify owner if email exists
      if (agent.owner_email) {
        const ownerSubject = status === "approved" 
          ? `Your agent ${agent.name} has been approved!`
          : `Your agent ${agent.name} was not approved`;
        
        const ownerText = status === "approved"
          ? `Congratulations! Your agent is now live on https://b7systems.vercel.app/agents/${agent.id}`
          : `Unfortunately your agent did not meet our guidelines.`;

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/send-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: agent.owner_email,
            subject: ownerSubject,
            text: ownerText,
          }),
        });
      }
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("Admin agent update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
