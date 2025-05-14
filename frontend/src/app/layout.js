// frontend/src/app/layout.js
import "@/styles/globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import MatchNotifier from "@/components/MatchNotifier";

export const metadata = {
  title: "AIffinity",
  description: "Aplicación de citas impulsada por IA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="
          m-0
          min-h-[100dvh]
          bg-gradient-to-r from-[#94b9ff] to-[#EEFFD7]
          bg-no-repeat
          bg-[length:100%_100%]
          overflow-x-hidden
        "
      >
        <Providers>
          <Header />
          <main className="px-3 sm:px-6 mx-auto">{children}</main>
          <MatchNotifier />
        </Providers>
      </body>
    </html>
  );
}
