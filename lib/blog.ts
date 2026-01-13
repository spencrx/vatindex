import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogPostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string; // always normalized to YYYY-MM-DD (or "")
};

function normalizeDate(value: unknown): string {
  // If frontmatter date is a Date object
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  // If it's a string, try to normalize it
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";

    // If already looks like YYYY-MM-DD, keep it
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

    // Try parsing other date strings
    const d = new Date(trimmed);
    if (!Number.isNaN(d.getTime())) {
      return d.toISOString().slice(0, 10);
    }

    // Fallback: return original string (better than empty)
    return trimmed;
  }

  return "";
}

export function getAllPosts(): BlogPostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const fullPath = path.join(BLOG_DIR, file);
    const raw = fs.readFileSync(fullPath, "utf8");
    const { data } = matter(raw);

    return {
      slug,
      title: String(data.title ?? slug),
      description: String(data.description ?? ""),
      date: normalizeDate(data.date),
    };
  });

  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

export function getPostSourceBySlug(slug: string): string | null {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf8");
}
