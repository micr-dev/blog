import type { ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 xl:max-w-5xl xl:px-0">
      <div className="flex min-h-screen flex-col justify-between font-sans">
        <Header />
        <main id="main-content" className="mb-auto" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </div>
    </section>
  );
}
