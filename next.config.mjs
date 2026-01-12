/** @type {import('next').NextConfig} */

import createMDX from "@next/mdx";

const nextConfig = {
  // ✅ keep your existing config untouched
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "libro-images.s3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "libro-images.s3.us-west-2.amazonaws.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "github.githubassets.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.figma.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.notion.so",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "about.coursera.org",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "d3njjcbhbojbot.cloudfront.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "react.dev",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.dribbble.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // ✅ add MDX support
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
