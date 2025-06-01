import "./globals.css";
import "./prism.css";
import { ClerkProvider } from "@clerk/nextjs";
import { AppContextProvider } from "@/context/AppContext";
import { inter } from './fonts';
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "AI Powered ChatBot",
  description: "Full Stack Project",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ClerkProvider>
          <AppContextProvider>
            <Toaster
              toastOptions={{
                success: { style: { background: "black", color: "white" } },
                error: { style: { background: "black", color: "white" } }
              }}
            />
            {children}
          </AppContextProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
