import { MetadataRoute } from "next";
import { getAllBookmarks } from "@/lib/data";
import { getAllPosts } from "@/lib/blog";
import { directory } from "@/directory.config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = directory.baseUrl;

  // Fetch all bookmarks
  const bookmarks = await getAllBookmarks();

  // Fetch all blog posts
  const posts = getAllPosts();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Dynamic pages from bookmarks
  const dynamicPages: MetadataRoute.Sitemap = bookmarks.map((bookmark) => ({
    url: `${baseUrl}/${bookmark.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Blog post pages
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...dynamicPages, ...blogPages];
}
