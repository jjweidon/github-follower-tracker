import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "깃팔추 - 깃허브 팔로워 추적기",
  description: "GitHub 팔로워/팔로잉을 추적하는 서비스",
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

