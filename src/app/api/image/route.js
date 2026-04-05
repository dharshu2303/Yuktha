import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const prompt = searchParams.get('prompt');

  if (!prompt) {
    return new NextResponse('Missing prompt', { status: 400 });
  }

  const enhancedPrompt = `High quality, professional business photography, ${prompt}`;
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1024&height=1024&nologo=true`;

  try {
    const headers = {};
    if (process.env.POLLINATIONS_API_KEY) {
      headers['Authorization'] = `Bearer ${process.env.POLLINATIONS_API_KEY}`;
    }

    const response = await fetch(pollinationsUrl, { headers });

    if (!response.ok) {
        throw new Error(`Pollinations API error: ${response.status}`);
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.redirect(`https://loremflickr.com/800/600/${encodeURIComponent(prompt)}`);
  }
}
