import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "@/styles/index.css";
import LenisRoot from "@/components/LenisRoot";

export const metadata: Metadata = {
  title: "Implement Design in Figma",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </head>
      <body className="m-0 min-h-full">
        <LenisRoot>{children}</LenisRoot>
      </body>
    </html>
  );
}
