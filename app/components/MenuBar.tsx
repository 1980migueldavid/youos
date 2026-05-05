"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function MenuBar() {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const gradientStyle = {
    background: "linear-gradient(135deg, #E85A1A, #C0C0C0)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  const iconStyle = (name: string) => ({
    cursor: "pointer",
    fontSize: "20px",
    transition: "all 0.2s",
    ...gradientStyle,
    opacity: hoveredIcon === name ? 1 : 0.8,
  });

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: "50px",
      background: "#000",
      borderBottom: "1px solid #1a1a1a",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 16px",
      zIndex: 999,
      maxWidth: "480px",
      margin: "0 auto",
      boxSizing: "border-box",
    }}>
      {/* Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center" }}>
        <Image
          src="/youos-logo.png"
          alt="YOUos"
          width={40}
          height={40}
          priority
          style={{ objectFit: "contain", cursor: "pointer" }}
        />
      </Link>

      {/* Icons Container - Neue Reihenfolge */}
      <div style={{
        display: "flex",
        gap: "24px",
        alignItems: "center",
      }}>
        {/* Profile */}
        <Link href="/profile" style={{ textDecoration: "none" }}>
          <div
            style={iconStyle("profile")}
            onMouseEnter={() => setHoveredIcon("profile")}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            👤
          </div>
        </Link>

        {/* Feed */}
        <Link href="/feed" style={{ textDecoration: "none" }}>
          <div
            style={iconStyle("feed")}
            onMouseEnter={() => setHoveredIcon("feed")}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            📰
          </div>
        </Link>

        {/* Settings */}
        <Link href="/settings" style={{ textDecoration: "none" }}>
          <div
            style={iconStyle("settings")}
            onMouseEnter={() => setHoveredIcon("settings")}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            ⚙️
          </div>
        </Link>

        {/* Hamburger Menu */}
        <div
          style={iconStyle("hamburger")}
          onMouseEnter={() => setHoveredIcon("hamburger")}
          onMouseLeave={() => setHoveredIcon(null)}
        >
          ☰
        </div>
      </div>
    </div>
  );
}
