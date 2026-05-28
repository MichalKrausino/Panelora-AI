import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
// --- IP Rate Limiting Constants ---
const MAX_GENERATIONS_PER_IP = 5;
const IP_LIMIT_TTL_SECONDS = 86400; // 24 hours

// Hash helper for privacy — never store raw IPs in Redis
function hashValue(value: string): string {
  return createHash('sha256').update(value.trim()).digest('hex');
}

export async function GET(req: Request) {
  try {
    const forwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = forwardedFor?.split(',')[0]?.trim() || 'unknown';
    const ipHash = hashValue(clientIp);
    const ipLimitKey = `panelora:ip_limit:${ipHash}`;
    const currentCount = await kv.get<number>(ipLimitKey) || 0;

    return NextResponse.json({
      remaining: Math.max(0, MAX_GENERATIONS_PER_IP - currentCount),
      limit: MAX_GENERATIONS_PER_IP
    });
  } catch (error) {
    return NextResponse.json({ remaining: MAX_GENERATIONS_PER_IP, limit: MAX_GENERATIONS_PER_IP });
  }
}

export async function POST(req: Request) {
  try {
    // ====================================================
    // 1. SERVER-SIDE IP-BASED RATE LIMITING
    // ====================================================
    const forwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = forwardedFor?.split(',')[0]?.trim() || 'unknown';
    const ipHash = hashValue(clientIp);

    const ipLimitKey = `panelora:ip_limit:${ipHash}`;

    // Check current generation count for this IP
    const currentCount = await kv.get<number>(ipLimitKey);

    if (currentCount !== null && currentCount >= MAX_GENERATIONS_PER_IP) {
      return NextResponse.json(
        { error: 'Vyčerpali jste limit 5 vizualizací zdarma pro vaši domácnost.', remaining: 0 },
        { status: 429 }
      );
    }

    // ====================================================
    // 2. PARSE REQUEST & CALL GEMINI
    // ====================================================
    const { imageUrl, textureId, roomType } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "Chybí obrázek místnosti" }, { status: 400 });
    }
    if (!textureId) {
      return NextResponse.json({ error: "Chybí ID textury lamel" }, { status: 400 });
    }

    const TEXTURE_PATHS: Record<string, string> = {
      bezovy_mramor: 'bezovy-mramor.jpg',
      cerny_mramor: 'cerny-mramor.JPG',
      cisty_mramor: 'cisty-mramor.jpg',
      kamen_svetly: 'kamen-svetly.jpg',
      kamen_tmavy: 'kamen-tmavy.jpeg',
      kralovska_modr: 'kralovska-modr.jpg',
      kremovy_kamen: 'kremovy-kamen.jpg',
      mramor_zlaty_dekor: 'mramor-zlaty-dekor.jpg',
      namodraly_mramor: 'namodraly-mramor.jpg',
      nocni_kamen: 'nocni-kamen.jpg',
      pisecny_dekor: 'pisecny-dekor.jpg',
      piskovcove_zily: 'piskovcove-zily.jpeg',
      ruzovy_mramor: 'ruzovy-mramor.jpg',
      ricni_kamen: 'ricni-kamen.jpg',
      smaragd: 'smaragd.jpg',
      svetla_skala: 'svetla-skala.jpg',
      zlata_zila: 'zlata-zila.png'
    };

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. Falling back to mockup for testing.");
      // Return the original room image as a mockup when API key is missing
      return NextResponse.json({
        stagedImageUrl: imageUrl,
        error: "Missing API Key",
        details: "Pro aktivaci Gemini AI virtuálního zařizování nastavte GEMINI_API_KEY."
      });
    }

    // Helper to parse base64 and MIME type from Data URL
    const parseBase64 = (dataUrl: string) => {
      let mimeType = 'image/jpeg';
      let base64Data = dataUrl;

      if (dataUrl.startsWith('data:')) {
        const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (match) {
          mimeType = match[1];
          base64Data = match[2];
        }
      }
      return { mimeType, base64Data };
    };

    const roomImage = parseBase64(imageUrl);

    // Read texture file locally
    const textureFilename = TEXTURE_PATHS[textureId] || 'cisty-mramor.jpg';
    const textureFilePath = path.join(process.cwd(), 'public', 'panely', textureFilename);
    const textureBuffer = fs.readFileSync(textureFilePath);
    const textureBase64Data = textureBuffer.toString('base64');
    const textureMimeType = textureFilename.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

    const textureImage = { mimeType: textureMimeType, base64Data: textureBase64Data };

    // Gemini Image Generation prompt
    const promptText = `
    SYSTEM ROLE:
You are a world-class architectural interior rendering AI specialized in photorealistic renovation visualization.

PRIMARY OBJECTIVE:
Using Image 1 as the base room and Image 2 as the exact PVC wall panel reference, create ONE single ultra-realistic luxury ${roomType || 'interior'} render.

ABSOLUTE PRIORITY RULES:
These rules override ALL artistic interpretation.

1. SINGLE FINAL IMAGE ONLY
- Generate exactly ONE photorealistic image.
- NEVER create:
  - split screens
  - before/after comparisons
  - collages
  - multiple angles
  - mood boards
  - image grids
  - duplicated rooms

2. STRICT MATERIAL APPLICATION
- Apply the PVC panel texture from Image 2 ONLY to vertical wall surfaces.
- NEVER apply the material to:
  - ceilings
  - floors
  - furniture
  - doors
  - windows
  - trim
  - columns
  - decorative objects

3. PRESERVE ORIGINAL ROOM STRUCTURE
- Maintain the exact:
  - room proportions
  - wall placement
  - ceiling height
  - camera angle
  - lens perspective
  - window positions
  - architectural layout
- DO NOT:
  - expand the room
  - invent new walls
  - change perspective
  - alter geometry
  - add fake windows
  - redesign the architecture

4. CEILING AND FLOOR CONTROL
- Ceiling must remain smooth white plaster or matte painted drywall.
- Floor must remain realistic high-end wood, vinyl, stone, or tile.
- Ceiling and floor must NEVER contain PVC panel texture.

5. REALISTIC PANEL INSTALLATION
- Match realistic PVC wall panel scaling based on 2800x1220mm dimensions.
- Include believable:
  - seams
  - alignment
  - edge finishing
  - reflections
  - material depth
  - micro shadows
- Panels must look physically installed, not digitally overlaid.

6. LUXURY INTERIOR STAGING
- Add tasteful modern luxury furniture and decor appropriate for a ${roomType || 'interior'}.
- Style should feel premium, minimal, contemporary, and architect-designed.
- Hide or replace unfinished construction elements with realistic finished materials.

7. PHOTOREALISM REQUIREMENTS
- Output must resemble a real professional interior photograph.
- Use:
  - realistic global illumination
  - natural shadows
  - physically accurate reflections
  - cinematic interior lighting
  - realistic exposure
- Avoid CGI appearance.

NEGATIVE INSTRUCTIONS:
DO NOT generate:
- distorted walls
- warped geometry
- duplicated furniture
- floating objects
- overexposed lighting
- blurry textures
- fake HDR halos
- unrealistic reflections
- extra rooms
- surreal design elements
- cartoon styling
- low-detail surfaces
- text or watermarks

FINAL OUTPUT:
Produce ONE flawless, cohesive, ultra-photorealistic finished interior render based on the original room geometry with PVC panels applied ONLY to the walls.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: roomImage.mimeType,
                    data: roomImage.base64Data
                  }
                },
                {
                  inlineData: {
                    mimeType: textureImage.mimeType,
                    data: textureImage.base64Data
                  }
                },
                { text: promptText }
              ]
            }
          ],
          generationConfig: {
            responseModalities: ["IMAGE"]
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error Response:", errorText);
      throw new Error(`Gemini API returned status ${response.status}: ${errorText}`);
    }

    const responseData = await response.json();

    // Parse response candidates
    const candidate = responseData.candidates?.[0];
    const part = candidate?.content?.parts?.[0];
    const inlineData = part?.inlineData || part?.inline_data;

    if (!inlineData || !inlineData.data) {
      throw new Error("Gemini model did not return any image data in candidates parts.");
    }

    const resultMimeType = inlineData.mimeType || 'image/png';
    const stagedImageUrl = `data:${resultMimeType};base64,${inlineData.data}`;

    // ====================================================
    // 3. INCREMENT IP RATE LIMIT COUNTER AFTER SUCCESS
    // ====================================================
    let newCount = 1;
    if (currentCount === null) {
      await kv.set(ipLimitKey, 1, { ex: IP_LIMIT_TTL_SECONDS });
    } else {
      newCount = (await kv.incr(ipLimitKey)) as number;
    }

    const remaining = Math.max(0, MAX_GENERATIONS_PER_IP - newCount);

    return NextResponse.json({ stagedImageUrl, remaining });

  } catch (error: any) {
    console.error("Gemini Staging Route Error:", error);
    return NextResponse.json({
      error: "Chyba při virtuálním zařizování pomocí Gemini AI",
      details: error.message
    }, { status: 500 });
  }
}