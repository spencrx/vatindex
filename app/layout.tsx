import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";
import "./globals.css";
import { Manrope as Font } from "next/font/google";

import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/craft";
import { EmailForm } from "@/components/email-form";

import { directory } from "@/directory.config";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Plus } from "lucide-react";

const font = Font({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: directory.title,
  description: directory.description,
  metadataBase: new URL(directory.baseUrl),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          {children}
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

const Header = () => {
  return (
    <header>
      <Container className="flex items-start justify-between gap-3">
        <Link href="/" className="transition-all hover:opacity-80">
          <Image src={Logo} alt="VATindex Logo" width={128} height={52.9} />
        </Link>

        <div className="flex items-center gap-2">
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="shadow-sm transition hover:shadow-md active:scale-[0.98]"
          >
            <Link href="/">Directory</Link>
          </Button>

          <Button
            asChild
            size="sm"
            variant="secondary"
            className="shadow-sm transition hover:shadow-md active:scale-[0.98]"
          >
            <Link href="/blog">Blog</Link>
          </Button>

          <AddListing />
        </div>
      </Container>
    </header>
  );
};

const Footer = () => {
  return (
    <footer>
      <Container className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} VATindex · Built with ❤️ by a human
        </p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
          <Link href="/disclaimer" className="hover:underline">
            Disclaimer
          </Link>
          <Link href="/sitemap.xml" className="hover:underline">
            Sitemap
          </Link>
          <ThemeToggle />
        </div>
      </Container>
    </footer>
  );
};

const AddListing = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center">
          <Plus className="mr-2 h-3 w-3" /> Add listing
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add your VAT accounting service</DialogTitle>
          <DialogDescription>
            Leave your email and we’ll reach out with next steps.
          </DialogDescription>
        </DialogHeader>
        <EmailForm />
      </DialogContent>
    </Dialog>
  );
};
