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

import { Heart } from "lucide-react";

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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${font.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
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
          <Image
            src={Logo}
            alt={`${directory.name} logo`}
            width={128}
            height={52.9}
          />
        </Link>
        <AddListing />
      </Container>
    </header>
  );
};

const Footer = () => {
  return (
    <footer>
      <Container className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {directory.VATindex} · Built with ❤️ by a human
        </p>
        <ThemeToggle />
      </Container>
    </footer>
  );
};

const AddListing = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="flex items-center">
          <Heart className="mr-2 h-3 w-3" /> Add listing
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add your listing</DialogTitle>
          <DialogDescription>
            Leave your email and I’ll get in touch.
          </DialogDescription>
        </DialogHeader>
        <EmailForm />
        <div className="h-px" />
      </DialogContent>
    </Dialog>
  );
};
