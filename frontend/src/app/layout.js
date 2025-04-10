// frontend/src/app/layout.js
import "@/styles/globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";

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
        </Providers>
      </body>
    </html>
  );
}
