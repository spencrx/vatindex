import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { Main, Section, Container } from "@/components/craft";

export const metadata = {
  title: "Blog",
  description: "VAT guides for founders.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <Main>
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl space-y-6">
            <h1>Blog</h1>
            <p className="text-muted-foreground">
              VAT guides for founders. Practical, no fluff.
            </p>

            <div className="space-y-4">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block rounded-lg border p-4 transition hover:bg-muted/40"
                >
                  <div className="text-sm text-muted-foreground">
                    {post.date}
                  </div>
                  <div className="text-lg font-semibold">{post.title}</div>
                  {post.description && (
                    <div className="text-sm text-muted-foreground">
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
