import { AppProviders } from "@/lib/providers/AppProviders";
import { Masthead, Main } from "@/lib/layout";
import { cn } from "@/lib/utils";
import { Toaster } from "@/lib/ui";
import { fontSans } from "./fonts";
import "./globals.css";

export const metadata = {
  title: "Kremer App",
  description: "Kremer family archives",
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={cn("min-h-screen antialiased", fontSans.variable)}>
        <AppProviders>
          <div className="flex flex-col w-full h-full min-h-screen flex-1">
            <Masthead />
            <Main>{children}</Main>
            {modal}
            <Toaster />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
