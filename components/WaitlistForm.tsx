"use client";

import { useEffect, useState, type FormEvent } from "react";
import { track } from "@/lib/analytics";
import { resolveSource } from "@/lib/source";
import { IconArrow } from "./Icons";

type Status = "idle" | "submitting" | "success" | "error";

const field =
  "h-12 w-full rounded-lg border border-line bg-white/[0.04] px-3.5 text-base text-white placeholder:text-white/35 outline-none transition-colors focus:border-brand focus:bg-white/[0.07]";

export function WaitlistForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [source, setSource] = useState("direct");

  useEffect(() => {
    let store: Storage | undefined;
    try {
      store = window.sessionStorage;
    } catch {
      store = undefined;
    }
    setSource(resolveSource(window.location.search, store));
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    const form = new FormData(e.currentTarget);
    setStatus("submitting");
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          firstName: form.get("firstName"),
          androidPhone: form.get("androidPhone"),
          cityState: form.get("cityState"),
          alphaInterest: form.get("alphaInterest") === "on",
          company: form.get("company"), // honeypot
          source,
        }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Something went wrong. Please try again.");
      track("waitlist_submitted", { source, alpha_interest: form.get("alphaInterest") === "on" });
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" aria-live="polite" className="panel rounded-3xl p-8 text-center sm:p-12">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-live/40 bg-live/15 text-live">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h3 className="mt-5 text-2xl font-semibold">You&rsquo;re in.</h3>
        <p className="mt-2 text-white/65">We&rsquo;ll reach out when OpenMaps testing opens in your area.</p>
      </div>
    );
  }

  const lbl = "mb-1.5 block text-[12px] font-semibold text-white/85";
  const opt = <span className="font-normal text-white/45"> (optional)</span>;

  return (
    <form onSubmit={onSubmit} noValidate className="panel rounded-3xl p-4 sm:p-6" aria-busy={status === "submitting"}>
      <div className="grid gap-3.5 sm:grid-cols-3">
        <label className="block">
          <span className={lbl}>Email <span className="text-brand-hi" aria-hidden="true">*</span></span>
          <input
            name="email" type="email" required autoComplete="email" inputMode="email"
            autoCapitalize="none" spellCheck={false} placeholder="you@example.com" className={field}
          />
        </label>
        <label className="block">
          <span className={lbl}>First name{opt}</span>
          <input name="firstName" type="text" autoComplete="given-name" placeholder="John" className={field} />
        </label>
        <label className="block">
          <span className={lbl}>Android phone{opt}</span>
          <input name="androidPhone" type="text" autoComplete="off" placeholder="Pixel 8" className={field} />
        </label>
        <label className="block">
          <span className={lbl}>City / State{opt}</span>
          <input name="cityState" type="text" autoComplete="off" placeholder="New York, NY" className={field} />
        </label>

        {/* Honeypot: hidden from people and assistive tech, bots fill it */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>Company<input name="company" type="text" tabIndex={-1} autoComplete="off" /></label>
        </div>

        <div className="sm:col-span-2 sm:self-end">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand text-[15px] font-semibold text-white shadow-[0_6px_28px_-8px_rgba(47,123,255,0.9)] transition-colors hover:bg-brand-hi active:bg-brand-press disabled:opacity-60"
          >
            {status === "submitting" ? "Joining…" : <>Join the Alpha <IconArrow /></>}
          </button>
        </div>

        <label className="flex min-h-10 cursor-pointer items-center gap-3 text-[14px] text-white/80 sm:col-span-3">
          <input name="alphaInterest" type="checkbox" className="h-5 w-5 shrink-0 accent-[#2f7bff]" />
          I want to test the Android Alpha
        </label>

        {status === "error" && (
          <p role="alert" className="text-center text-sm text-[#ff8a8a] sm:col-span-3">{error}</p>
        )}
        <p className="text-xs text-white/40 sm:col-span-3">
          Only your email is required. See our{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-white/70">Privacy Policy</a> and{" "}
          <a href="/terms" className="underline underline-offset-2 hover:text-white/70">Alpha Terms</a>.
        </p>
      </div>
    </form>
  );
}
