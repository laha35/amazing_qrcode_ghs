// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

// 💡 Qrscan 컴포넌트는 이곳에 임포트하지 않습니다. (구조적 우려 해소)

export const metadata: Metadata = {
  title: "코딩의 정석부 QR Pass",
  description: "코딩의 정석부 부스 체험 상태 관리 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      {/* 모바일 환경 최적화를 위한 뷰포트 설정 */}
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      {/* h-screen으로 전체 화면 높이를 확보 */}
      <body className="bg-gray-50 min-h-screen">
        <main className="max-w-xl mx-auto min-h-screen relative pb-28">
          {/* pb-28: 하단 QR 버튼 공간 확보 */}
          {children}
        </main>
      </body>
    </html>
  );
}
