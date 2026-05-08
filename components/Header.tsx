import Link from "next/link";
import { Home } from "lucide-react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/analyzer", label: "Deal Analyzer" },
  { href: "/markets", label: "Market Finder" },
  { href: "/alerts", label: "Deal Alerts" },
  { href: "/early-access", label: "Early Access" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#16B7C9] shadow-lg shadow-[#16B7C9]/20">
            <Home className="h-5 w-5 text-white" />
          </div>

          <div>
            <div className="text-xl font-bold tracking-tight text-[#062A55]">
              BuyToRent AI
            </div>
            <div className="text-xs text-slate-500">
              Buy low. Rent high.
            </div>
          </div>
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
