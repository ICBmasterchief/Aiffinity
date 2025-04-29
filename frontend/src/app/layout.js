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
      <body>
        <Providers>
          <Header />
          {children}
          <MatchNotifier />
        </Providers>
      </body>
    </html>
  );
}
