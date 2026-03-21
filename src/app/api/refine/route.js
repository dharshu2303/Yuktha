import { NextResponse } from "next/server";
import { refineContent } from "@/lib/gemini";

export async function POST(request) {
  try {
    const { previewData, publishedData, userMessage, language } = await request.json();

    if (!previewData || !publishedData || !userMessage) {
      return NextResponse.json(
        { error: "Data and message are required" },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 }
      );
    }

    const result = await refineContent(
      previewData,
      publishedData,
      userMessage,
      language || "en"
    );

    return NextResponse.json({
      updatedPreviewContent: result.updatedPreviewContent,
      updatedPublishedContent: result.updatedPublishedContent,
      updatedPreviewData: result.updatedPreviewData,
      updatedPublishedData: result.updatedPublishedData,
      aiMessage: result.aiMessage,
    });
  } catch (error) {
    console.error("Refine API error:", error);

    const isRateLimited =
      error.status === 429 ||
      error.message?.includes("429") ||
      error.message?.includes("quota") ||
      error.message?.includes("RESOURCE_EXHAUSTED");

    return NextResponse.json(
      {
        error: isRateLimited
          ? "Rate limit exceeded. Please wait a minute and try again."
          : error.message || "Refinement failed",
      },
      { status: isRateLimited ? 429 : 500 }
    );
  }
}
