import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NotiFee",
  description: "Save on crypto transaction fees",
  icons: "/icons/favicon.svg",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={`${inter.className} min-h-screen font-sans antialiased`}>
        <div className='mx-auto flex min-h-screen max-w-[2560px] flex-col'>{children}</div>
      </body>
    </html>
  );
}
