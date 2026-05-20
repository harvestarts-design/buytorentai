"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/mortgage-estimator", label: "Calculators" },
  { href: "/markets", label: "Market Finder" },
  { href: "/alerts", label: "Deal Alerts" },
];

const learnMoreNav = [
  { href: "/early-access", label: "Early Access" },
  { href: "/partners", label: "For Partners" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 lg:px-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/public/buytorent-logo.png"
            alt="BuyToRent AI"
            width={380}
            height={190}
            priority
            className="h-28 w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-1 rounded-2xl border border-slate-200 bg-slate-100 p-1 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-[#062A55] transition hover:bg-white hover:text-[#16B7C9]"
            >
              {item.label}
            </Link>
          ))}

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((current) => !current)}
              className="inline-flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-semibold text-[#062A55] transition hover:bg-white hover:text-[#16B7C9]"
            >
              Learn More
              <ChevronDown className="h-4 w-4" />
            </button>

            {open && (
              <div className="absolute right-0 top-12 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                {learnMoreNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#062A55] transition hover:bg-slate-100 hover:text-[#16B7C9]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <Link
          href="/early-access"
          className="rounded-2xl bg-[#16B7C9] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#119AA9]"
        >
          Get early access
        </Link>
      </div>
    </header>
  );
}
