import { NextResponse } from "next/server";
import { load } from "cheerio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_HEADERS: Record<string, string> = {
  // More realistic browser-ish headers (helps with many 403s)
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  // Some sites gate content without a referer
  Referer: "https://www.google.com/",
};

function toAbsoluteUrl(maybeRelative: string, origin: string) {
  try {
    return new URL(maybeRelative, origin).toString();
  } catch {
    return "";
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const urlParam = searchParams.get("url");

    if (!urlParam) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let target: URL;
    try {
      target = new URL(urlParam);
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
    }

    // Try fetch with realistic headers
    const res = await fetch(target.toString(), {
      method: "GET",
      headers: DEFAULT_HEADERS,
      redirect: "follow",
    });

    // If blocked, return JSON error with status
    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL (${res.status})` },
        { status: res.status },
      );
    }

    const html = await res.text();
    const $ = load(html);

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").first().text().trim() ||
      target.hostname;

    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";

    let favicon =
      $('link[rel="icon"]').attr("href") ||
      $('link[rel="shortcut icon"]').attr("href") ||
      $('link[rel="apple-touch-icon"]').attr("href") ||
      "/favicon.ico";

    if (favicon && !favicon.startsWith("http")) {
      favicon = toAbsoluteUrl(favicon, target.origin) || `${target.origin}/favicon.ico`;
    }

    let ogImage =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      "";

    if (ogImage && !ogImage.startsWith("http")) {
      ogImage = toAbsoluteUrl(ogImage, target.origin);
    }

    return NextResponse.json(
      {
        title,
        description,
        favicon,
        ogImage,
        url: target.toString(),
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch (err) {
    console.error("Metadata error:", err);
    return NextResponse.json(
      { error: "Failed to fetch metadata" },
      { status: 500 },
    );
  }
}
