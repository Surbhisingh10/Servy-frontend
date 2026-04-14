import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

interface LeadPayload {
  fullName?: string;
  restaurantName?: string;
  city?: string;
  email: string;
  phone?: string;
  message?: string;
  restaurantType?: string;
  outletCount?: string;
  demoTopic?: string;
  source?: string;
}

function buildEmailHtml(lead: Required<LeadPayload> & { submittedAt: string }): string {
  const rows = [
    ['Name', lead.fullName],
    ['Restaurant', lead.restaurantName],
    ['City', lead.city],
    ['Email', `<a href="mailto:${lead.email}">${lead.email}</a>`],
    ['Phone', lead.phone],
    ['Restaurant Type', lead.restaurantType],
    ['Outlet Count', lead.outletCount],
    ['Demo Topic', lead.demoTopic],
    ['Message', lead.message],
    ['Source', lead.source],
    ['Submitted At', new Date(lead.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })],
  ]
    .filter(([, v]) => v)
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 14px;font-weight:600;color:#374151;white-space:nowrap;vertical-align:top;">${label}</td>
        <td style="padding:10px 14px;color:#111827;">${value}</td>
      </tr>`,
    )
    .join('');

  return `
    <div style="font-family:sans-serif;max-width:580px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb;">
      <div style="background:#059669;padding:24px 28px;">
        <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">New Lead — Servy</h1>
        <p style="margin:6px 0 0;color:#a7f3d0;font-size:13px;">Someone submitted the contact / demo form on servyworld.com</p>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tbody>${rows}</tbody>
      </table>
      <div style="padding:16px 28px;background:#f9fafb;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
        Reply directly to this email to respond to the lead.
      </div>
    </div>`;
}

async function sendLeadEmail(lead: Required<LeadPayload> & { submittedAt: string }) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM ?? 'onboarding@resend.dev',
    to: 'business@servyworld.com',
    replyTo: lead.email,
    subject: `New lead: ${lead.fullName || lead.email}${lead.restaurantName ? ` — ${lead.restaurantName}` : ''}`,
    html: buildEmailHtml(lead),
  });

  process.stdout.write(`[Resend response] data=${JSON.stringify(data)} error=${JSON.stringify(error)}\n`);

  if (error) {
    throw new Error(`Resend error: ${JSON.stringify(error)}`);
  }
}

export async function POST(req: NextRequest) {
  let body: LeadPayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body.email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const lead = {
    fullName: body.fullName ?? '',
    restaurantName: body.restaurantName ?? '',
    city: body.city ?? '',
    email: body.email,
    phone: body.phone ?? '',
    message: body.message ?? '',
    restaurantType: body.restaurantType ?? '',
    outletCount: body.outletCount ?? '',
    demoTopic: body.demoTopic ?? '',
    source: body.source ?? 'contact',
    submittedAt: new Date().toISOString(),
  };

  try {
    await sendLeadEmail(lead);
  } catch (err) {
    process.stderr.write(`[Lead email error] ${String(err)}\n`);
    if (process.env.NODE_ENV !== 'production') {
      return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
