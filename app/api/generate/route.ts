import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.error("Missing GROQ_API_KEY");
      return NextResponse.json({ error: "Missing GROQ_API_KEY" }, { status: 500 });
    }

    const body = await request.json().catch(() => ({}));

    const url: string | undefined = body?.url;
    const searchResultsInput = body?.searchResults ?? body?.search_results ?? body?.search_results_raw;

    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }

    // Normalize search results (string JSON -> object, object/array -> keep, missing -> empty)
    let parsedResults: unknown = searchResultsInput ?? "";
    if (typeof searchResultsInput === "string") {
      try {
        parsedResults = JSON.parse(searchResultsInput);
      } catch {
        parsedResults = searchResultsInput; // keep raw string if not JSON
      }
    }

    const prompt = `You are a helpful assistant that writes clear, concise summaries of web content.
Based on the search results and content from ${url}, write a brief but comprehensive overview.

Focus on:
- The main purpose or value proposition
- Key features or main points
- Target audience or use cases
- What makes it unique or noteworthy

Format the response in markdown and keep it under 200 words. Make it engaging and informative.

Context from the webpage:
${JSON.stringify(parsedResults, null, 2)}`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Groq API error:", res.status, text);
      return NextResponse.json(
        { error: "Groq request failed", status: res.status, details: text },
        { status: 502 }
      );
    }

    const data = await res.json();
    const overview = data?.choices?.[0]?.message?.content ?? "";

    return NextResponse.json({ overview });
  } catch (error) {
    console.error("Error generating overview:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: `Failed to generate overview: ${errorMessage}` },
      { status: 500 }
    );
  }
}
