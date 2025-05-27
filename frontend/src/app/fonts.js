// frontend/src/app/fonts.js
import { Chivo } from "next/font/google";

export const chivo = Chivo({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-chivo",
  display: "swap",
});
