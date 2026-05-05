import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: "YOUos – Daily Execution",
  description: "Do what you said to yourself.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background:"#000", color:"#F0EDE8", minHeight:"100vh", maxWidth:"480px", margin:"0 auto", position:"relative" }}>
        {/* Logo - Top Left */}
        <Link href="/" style={{
          position:"fixed",
          top:"16px",
          left:"16px",
          zIndex:1000,
          display:"flex",
          alignItems:"center",
          justifyContent:"center"
        }}>
          <Image
            src="/youos-logo.png"
            alt="YOUos"
            width={40}
            height={40}
            priority
            style={{ objectFit:"contain", cursor:"pointer" }}
          />
        </Link>
        
        {children}
      </body>
    </html>
  );
}
