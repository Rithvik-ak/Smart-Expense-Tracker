import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import GlobalEffects from "@/components/GlobalEffects";
import LoadingScreen from "@/components/LoadingScreen";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Astra — The Operating System for Students",
  description: "Your life, optimized. Manage money, time, and goals in one futuristic system.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#030712] text-slate-50 leading-relaxed font-sans">
        <LoadingScreen />
        <GlobalEffects />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

