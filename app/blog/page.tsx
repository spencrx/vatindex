import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { Main, Section, Container } from "@/components/craft";

export const metadata = {
  title: "Blog",
  description: "VAT guides for founders.",
};

function formatDate(input: unknown) {
  // supports Date or "YYYY-MM-DD"
  const d =
    input instanceof Date
      ? input
      : typeof input === "string"
        ? new Date(`${input}T00:00:00Z`)
        : null;

  if (!d || Number.isNaN(d.getTime())) return "";

  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <Main>
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl space-y-6">
            <h1>Blog</h1>
            <p className="text-muted-foreground">
              VAT guides for founders.
            </p>

            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block rounded-lg border p-4 transition hover:bg-muted/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-sm text-muted-foreground">
                      {formatDate(post.date) || ""}
                    </div>

                    <div className="text-sm text-muted-foreground underline underline-offset-4">
                      Read →
                    </div>
                  </div>

                  <div className="mt-2 text-lg font-semibold">{post.title}</div>

                  {post.description && (
                    <div className="mt-1 text-sm text-muted-foreground">
                      {post.description}
                    </div>
                  )}
                </Link>
              ))}

              {posts.length === 0 && (
                <div className="text-muted-foreground">No posts yet.</div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </Main>
  );
}
