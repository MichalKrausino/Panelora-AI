import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { kv } from '@vercel/kv';

export async function POST(req: Request) {
  try {
    const { email, stagedImageUrl, panelName, roomType } = await req.json();

    if (!email || !stagedImageUrl) {
      return NextResponse.json(
        { error: 'Chybí e-mail nebo vizualizace.' },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || '';

    if (!resendApiKey) {
      console.warn('[send-visualization] RESEND_API_KEY is not set. Skipping email delivery.');
      return NextResponse.json({ success: false, error: 'Email service not configured.' });
    }

    // Extract raw base64 data and MIME type from the data URL
    let imageBase64 = stagedImageUrl;
    let mimeType = 'image/png';

    if (stagedImageUrl.startsWith('data:')) {
      const match = stagedImageUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        imageBase64 = match[2];
      }
    }

    // Determine file extension from MIME type
    const ext = mimeType === 'image/jpeg' ? 'jpg' : 'png';

    const resend = new Resend(resendApiKey);

    const displayRoomType = roomType || 'interiér';
    const displayPanelName = panelName || 'panel';
    const shopUrl = `https://eshop.panelora.cz`;

    await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: 'Vaše nová AI vizualizace od Panelora.cz 🌟',
      attachments: [
        {
          filename: `panelora-vizualizace-${displayPanelName.toLowerCase().replace(/\s+/g, '-')}.${ext}`,
          content: imageBase64,
          contentType: mimeType,
        },
      ],
      html: `
<!DOCTYPE html>
<html lang="cs">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:600px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

        <!-- ===== HEADER ===== -->
        <tr><td style="background:#000000;padding:28px 36px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <span style="color:#ffffff;font-size:22px;font-weight:900;letter-spacing:3px;">PANELORA</span>
              </td>
              <td align="right">
                <span style="color:rgba(255,255,255,0.5);font-size:11px;font-weight:600;letter-spacing:1px;">AI VIZUALIZACE</span>
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- ===== HERO IMAGE ===== -->
        <tr><td style="padding:40px 36px; text-align:center; background-color:#f8fafc; border-bottom:1px solid #f1f5f9;">
          <div style="border:2px dashed #cbd5e1; border-radius:16px; padding:32px 24px; background:#ffffff; display:inline-block; max-width:85%;">
            <span style="font-size:36px; display:block; margin-bottom:12px;">🖼️</span>
            <h3 style="margin:0 0 6px; font-size:16px; font-weight:700; color:#0f172a;">Návrh v plné kvalitě najdete v příloze</h3>
            <p style="margin:0; font-size:12px; color:#64748b; line-height:1.5;">Obrázek jsme vám bezpečně přibalili jako soubor přímo k tomuto e-mailu. Stáhněte si ho do telefonu nebo počítače.</p>
          </div>
        </td></tr>

        <!-- ===== BODY CONTENT ===== -->
        <tr><td style="padding:32px 36px 24px;">
          <h1 style="margin:0 0 6px;font-size:22px;font-weight:800;color:#0f172a;line-height:1.3;">
            Vaše AI vizualizace je hotová! ✨
          </h1>
          <p style="margin:0 0 20px;font-size:14px;color:#64748b;line-height:1.6;">
            Dobrý den, posíláme vám vaši AI vizualizaci z Panelora.cz! Podívejte se, jak luxusně vypadá panel
            <strong style="color:#0f172a;">${displayPanelName}</strong> ve vašem prostoru
            (<strong style="color:#0f172a;">${displayRoomType}</strong>).
          </p>

          <!-- Panel info card -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:24px;">
            <tr>
              <td style="padding:16px 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="50%" style="padding:4px 0;">
                      <span style="display:block;font-size:9px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Panel</span>
                      <span style="display:block;font-size:14px;color:#0f172a;font-weight:700;margin-top:2px;">${displayPanelName}</span>
                    </td>
                    <td width="50%" style="padding:4px 0;">
                      <span style="display:block;font-size:9px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Typ místnosti</span>
                      <span style="display:block;font-size:14px;color:#0f172a;font-weight:700;margin-top:2px;">${displayRoomType}</span>
                    </td>
                  </tr>
                  <tr>
                    <td width="50%" style="padding:4px 0;">
                      <span style="display:block;font-size:9px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Materiál</span>
                      <span style="display:block;font-size:14px;color:#0f172a;font-weight:700;margin-top:2px;">PVC Panel</span>
                    </td>
                    <td width="50%" style="padding:4px 0;">
                      <span style="display:block;font-size:9px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;">Rozměry</span>
                      <span style="display:block;font-size:14px;color:#0f172a;font-weight:700;margin-top:2px;">2800 × 1220 mm</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- CTA Button -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding:0 0 16px;">
              <a href="${shopUrl}" target="_blank" style="display:inline-block;background:#000000;color:#ffffff;font-size:14px;font-weight:800;text-decoration:none;padding:14px 36px;border-radius:12px;letter-spacing:0.5px;">
                Prohlédnout panel ${displayPanelName} na e-shopu →
              </a>
            </td></tr>
          </table>

          
        <!-- ===== FOOTER ===== -->
        <tr><td style="padding:20px 36px 28px;border-top:1px solid #f1f5f9;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <span style="font-size:10px;color:#cbd5e1;font-weight:600;">© ${new Date().getFullYear()} Panelora — Prémiové stěnové panely</span>
              </td>
              <td align="right">
                <a href="https://panelora.cz" target="_blank" style="font-size:10px;color:#94a3b8;text-decoration:none;font-weight:600;">panelora.cz</a>
              </td>
            </tr>
          </table>
          <p style="margin:10px 0 0;font-size:9px;color:#cbd5e1;line-height:1.4;">
            Vizualizace je vytvořena umělou inteligencí a slouží pouze jako ilustrace. Skutečná barevnost a proporce se mohou mírně lišit. Obrázek v plné kvalitě najdete v příloze tohoto e-mailu.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>
      `.trim(),
      headers: {
        'X-Entity-Ref-ID': `panelora-viz-${Date.now()}`,
      },
    });

    await kv.lpush('panelora:leads', email);
    console.log(`[Database] Email ${email} archived to leads list.`);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('[send-visualization] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Nepodařilo se odeslat vizualizaci e-mailem.' },
      { status: 500 }
    );
  }
}
