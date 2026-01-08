import { NextResponse } from "next/server";
import { load } from "cheerio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const urlParam = searchParams.get("url");

    if (!urlParam) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    let validUrl: URL;
    try {
      validUrl = new URL(urlParam);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const response = await fetch(validUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; DirectoryBot/1.0; +https://example.com)",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL (${response.status})` },
        { status: response.status }
      );
    }

    const html = await response.text();
    const $ = load(html);

    // Title
    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").first().text().trim() ||
      validUrl.hostname;

    // Description
    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";

    // Favicon
    let favicon =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      "/favicon.ico";

    if (favicon && !favicon.startsWith("http")) {
      favicon = new URL(favicon, validUrl.origin).toString();
    }

    // Open Graph image
    let ogImage =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      "";

    if (ogImage && !ogImage.startsWith("http")) {
      ogImage = new URL(ogImage, validUrl.origin).toString();
    }

    return NextResponse.json(
      {
        title,
        description,
        favicon,
        ogImage,
        url: validUrl.toString(),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Metadata error:", error);
    return NextResponse.json(
      { error: "Failed to fetch metadata" },
      { status: 500 }
    );
  }
}
