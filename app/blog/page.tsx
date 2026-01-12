import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { Main, Section, Container } from "@/components/craft";

export const metadata = {
  title: "Blog",
  description: "VAT guides for founders.",
};

function formatDate(date: string) {
  // Expects "YYYY-MM-DD" from frontmatter
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
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
          <div className="mx-auto max-w-2xl space-y-8">
            <div className="space-y-3">
              <h1 className="text-4xl font-semibold tracking-tight">Blog</h1>
              <p className="text-muted-foreground">
                VAT guides for founders.
              </p>
            </div>

            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group block rounded-xl border bg-background p-5 shadow-sm transition hover:-translate-y-0.5 hover:bg-muted/30 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-xs text-muted-foreground">
                      {formatDate(post.date)}
                    </div>
                    <span className="text-xs text-muted-foreground transition group-hover:text-foreground">
                      Read →
                    </span>
                  </div>

                  <div className="mt-2 text-xl font-semibold leading-snug tracking-tight">
                    {post.title}
                  </div>

                  {post.description && (
                    <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {post.description}
                    </div>
                  )}
                </Link>
              ))}

              {posts.length === 0 && (
                <div className="rounded-xl border p-6 text-muted-foreground">
                  No posts yet.
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </Main>
  );
}
