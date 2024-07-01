import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NotiFee",
  description: "Save on crypto transaction fees",
  icons: "/icons/favicon.svg",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script src="https://js.stripe.com/v3/" strategy="beforeInteractive" />
      </head>
      <body className={`${inter.className} min-h-screen font-sans antialiased`}>
        <ToastContainer />
        <div className="mx-auto flex min-h-screen max-w-[2560px] flex-col">{children}</div>
      </body>
    </html>
  );
}
