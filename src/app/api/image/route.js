import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const prompt = searchParams.get('prompt');

  if (!prompt) {
    return new NextResponse('Missing prompt', { status: 400 });
  }

  const apiKey = process.env.STABILITY_API_KEY;
  // If no API key is set, fallback to the free placeholder
  if (!apiKey) {
    return NextResponse.redirect(`https://loremflickr.com/800/600/${encodeURIComponent(prompt)}`);
  }

  try {
    const response = await fetch(
      'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'image/png',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: `High quality, professional business photography, ${prompt}`,
              weight: 1,
            },
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          steps: 30,
          samples: 1,
        }),
      }
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Stability API error:', response.status, errorText);
        // Fallback on error
        return NextResponse.redirect(`https://loremflickr.com/800/600/${encodeURIComponent(prompt)}`);
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable', // Cache the generated image
      },
    });
  } catch (error) {
    console.error('Image generation error:', error);
    // Fallback on network/fetch error
    return NextResponse.redirect(`https://loremflickr.com/800/600/${encodeURIComponent(prompt)}`);
  }
}
