import RoleContext, { RoleProvider } from "@/context/RoleContext"; // ✅ 경로 수정

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <RoleProvider>
          {children} {/* ✅ `RoleProvider`가 모든 페이지를 감싸도록 수정 */}
        </RoleProvider>
      </body>
    </html>
  );
}
