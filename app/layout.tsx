import type { Metadata } from "next";
import "./globals.css";
import MenuBar from "./components/MenuBar";

export const metadata: Metadata = {
  title: "YOUos – Daily Execution",
  description: "Do what you said to yourself.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background:"#000", color:"#F0EDE8", minHeight:"100vh", maxWidth:"480px", margin:"0 auto", position:"relative" }}>
        <MenuBar />
        <div style={{ paddingTop: "50px" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
