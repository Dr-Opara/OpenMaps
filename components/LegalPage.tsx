import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { LEGAL_UPDATED } from "@/lib/site";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <Header base="/" />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-28">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-white/45">Last updated {LEGAL_UPDATED}</p>
        <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-white/75 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-white [&_li]:mt-2 [&_p+p]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_a]:text-cyan [&_a]:underline [&_a]:underline-offset-2">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
