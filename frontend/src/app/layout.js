// frontend/src/app/layout.js
import "@/styles/globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header"; // Opcional, si deseas tener un header global

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
