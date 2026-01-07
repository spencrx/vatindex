import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url, searchResults } = await request.json();

    if (!url || !searchResults) {
      return NextResponse.json(
        { error: "URL and search results are required" },
        { status: 400 }
      );
    }

    let parsedResults: unknown;
    try {
      parsedResults = JSON.parse(searchResults);
    } catch {
      parsedResults = searchResults;
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
      return NextResponse.json(
        { error: `Groq error: ${text}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const overview = data?.choices?.[0]?.message?.content ?? "";

    return NextResponse.json({ overview });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error generating overview:", errorMessage);
    return NextResponse.json(
      { error: `Failed to generate overview: ${errorMessage}` },
      { status: 500 }
    );
  }
}
