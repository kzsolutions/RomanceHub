import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "RomanceHub — Histórias de romance para ler online",
    template: "%s · RomanceHub",
  },
  description:
    "Biblioteca digital de romances originais em português. Descobre, lê e revive histórias de amor, paixão e segundas chances.",
  keywords: [
    "romance",
    "livros digitais",
    "ebooks",
    "histórias de amor",
    "ler online",
    "romance em português",
  ],
  verification: {
    google: "DJGP5TEQ4qV3REEsdDJjBWD3lbLPJsnpeNphCXrBZWI",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffbfc" },
    { media: "(prefers-color-scheme: dark)", color: "#120d10" },
  ],
  width: "device-width",
  initialScale: 1,
};

const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}if(t==="dark"){document.documentElement.classList.add("dark");}}catch(e){}})();`;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-PT" suppressHydrationWarning>
      <head>
        {supabaseUrl && (
          <>
            <link rel="preconnect" href={supabaseUrl} crossOrigin="anonymous" />
            <link rel="dns-prefetch" href={supabaseUrl} />
          </>
        )}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {process.env.NODE_ENV === "production" && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5046331576710773"
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className={`${playfair.variable} ${manrope.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}
