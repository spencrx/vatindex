import Link from "next/link";
import { notFound } from "next/navigation";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import GithubSlugger from "github-slugger";

import { Main, Section, Container } from "@/components/craft";
import { getAllPosts, getPostSourceBySlug } from "@/lib/blog";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const mdxComponents = {
  a: (props: any) => (
    <a
      {...props}
      className={`underline underline-offset-4 hover:opacity-80 ${props.className ?? ""}`}
      target={props.href?.startsWith("http") ? "_blank" : undefined}
      rel={props.href?.startsWith("http") ? "noreferrer" : undefined}
    />
  ),
  // eslint-disable-next-line @next/next/no-img-element
  img: (props: any) => <img {...props} className={`rounded-lg ${props.className ?? ""}`} />,
};

type TocItem = { id: string; text: string; level: 2 | 3 };

function formatDate(date: string) {
  // Expects YYYY-MM-DD
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/**
 * Extract h2/h3 headings from MDX source.
 * - ignores code fences
 * - generates stable ids matching rehype-slug using github-slugger
 */
function buildTocFromMdx(source: string): TocItem[] {
  const slugger = new GithubSlugger();

  // remove fenced code blocks so we don't pick up headings inside code
  const withoutCode = source.replace(/```[\s\S]*?```/g, "");

  const lines = withoutCode.split("\n");
  const toc: TocItem[] = [];

  for (const line of lines) {
    const m = /^(##|###)\s+(.*)\s*$/.exec(line);
    if (!m) continue;

    const level = m[1] === "##" ? 2 : 3;
    const rawText = m[2]
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // strip markdown links
      .replace(/[*_`~]/g, "") // strip basic md tokens
      .trim();

    if (!rawText) continue;

    const id = slugger.slug(rawText);
    toc.push({ id, text: rawText, level: level as 2 | 3 });
  }

  return toc;
}

type FaqItem = { q: string; a: string };

function normalizeFaq(data: any): FaqItem[] {
  const faq = data?.faq;
  if (!Array.isArray(faq)) return [];
  return faq
    .map((item: any) => ({
      q: typeof item?.q === "string" ? item.q : "",
      a: typeof item?.a === "string" ? item.a : "",
    }))
    .filter((x) => x.q && x.a);
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const raw = getPostSourceBySlug(params.slug);
  if (!raw) return {};
  const { data } = matter(raw);

  const title = String(data.title ?? "Blog");
  const description = String(data.description ?? "");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const raw = getPostSourceBySlug(params.slug);
  if (!raw) return notFound();

  const { data, content } = matter(raw);

  const title = String(data.title ?? params.slug);
  const description = String(data.description ?? "");
  const date = String(data.date ?? "");

  const toc = buildTocFromMdx(content);
  const faq = normalizeFaq(data);

  const faqJsonLd =
    faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }
      : null;

  return (
    <Main>
      <Section>
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="mb-10">
              <Link href="/blog" className="text-sm text-muted-foreground hover:underline">
                ← Back to blog
              </Link>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight">{title}</h1>

              {description && <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>}

              {date && <p className="mt-3 text-sm text-muted-foreground">{formatDate(date)}</p>}
            </div>

            {faqJsonLd && (
              <script
                type="application/ld+json"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
              />
            )}

            <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
              {/* TOC */}
              <aside className="hidden lg:block">
                <div className="sticky top-24 rounded-xl border bg-background p-4">
                  <div className="text-sm font-medium">On this page</div>

                  {toc.length === 0 ? (
                    <div className="mt-3 text-sm text-muted-foreground">
                      Add <code>##</code> headings to show a table of contents.
                    </div>
                  ) : (
                    <nav className="mt-3 space-y-1 text-sm">
                      {toc.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className={`block rounded px-2 py-1 text-muted-foreground hover:bg-muted/40 hover:text-foreground ${
                            item.level === 3 ? "ml-3" : ""
                          }`}
                        >
                          {item.text}
                        </a>
                      ))}
                    </nav>
                  )}
                </div>
              </aside>

              {/* Article */}
              <div>
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

                {/* FAQ (optional via frontmatter) */}
                {faq.length > 0 && (
                  <section className="mt-12">
                    <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
                    <p className="mt-2 text-muted-foreground">
                      Quick answers to common questions founders ask.
                    </p>

                    <div className="mt-6 rounded-xl border bg-background p-2">
                      <Accordion type="single" collapsible>
                        {faq.map((item, idx) => (
                          <AccordionItem key={idx} value={`faq-${idx}`}>
                            <AccordionTrigger className="px-3 text-left">
                              {item.q}
                            </AccordionTrigger>
                            <AccordionContent className="px-3 pb-4 text-muted-foreground">
                              {item.a}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </Main>
  );
}
