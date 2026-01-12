import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { Main, Section, Container } from "@/components/craft";
import { getAllPosts, getPostSourceBySlug } from "@/lib/blog";

const mdxComponents = {
  a: (props: any) => (
    <a
      {...props}
      className={`underline underline-offset-4 hover:opacity-80 ${props.className ?? ""}`}
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noreferrer" : undefined}
    />
  ),
  img: (props: any) => {
    // Basic safe default for MDX images
    // If you want Next/Image behavior for all mdx images, tell me and I’ll upgrade this.
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} className={`rounded-lg ${props.className ?? ""}`} />;
  },
};

export async function generateStaticParams() {
  // optional: allows static generation of blog pages at build time
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const raw = getPostSourceBySlug(params.slug);
  if (!raw) return {};
  const { data } = matter(raw);

  return {
    title: String(data.title ?? "Blog"),
    description: String(data.description ?? ""),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const raw = getPostSourceBySlug(params.slug);
  if (!raw) return notFound();

  const { data, content } = matter(raw);

  const title = String(data.title ?? params.slug);
  const description = String(data.description ?? "");
  const date = String(data.date ?? "");

  return (
    <Main>
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl">
            <div className="mb-8">
              <Link href="/blog" className="text-sm text-muted-foreground hover:underline">
                ← Back to blog
              </Link>
              <h1 className="mt-4">{title}</h1>
              {description && (
                <p className="mt-2 text-muted-foreground">{description}</p>
              )}
              {date && (
                <p className="mt-2 text-sm text-muted-foreground">{date}</p>
              )}
            </div>

            <article className="prose prose-neutral dark:prose-invert max-w-none">
              <MDXRemote
                source={content}
                components={mdxComponents}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [
                      rehypeSlug,
                      [
                        rehypeAutolinkHeadings,
                        {
                          behavior: "wrap",
                        },
                      ],
                    ],
                  },
                }}
              />
            </article>
          </div>
        </Container>
      </Section>
    </Main>
  );
}
