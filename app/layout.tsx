import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GFT - Github Follower Tracker",
  description: "GitHub 팔로워/팔로잉 히스토리를 추적하고 시각화하는 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

