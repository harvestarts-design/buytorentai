import React from "react";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[2rem] border border-slate-200 bg-[#062A55] text-white shadow-xl ${className}`}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  href,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
}) {
  const base = `inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#16B7C9] px-6 font-bold text-white transition hover:bg-[#119AA9] ${className}`;

  if (href) {
    return (
      <a href={href} className={base}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={base}>
      {children}
    </button>
  );
}

export function Metric({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-3xl bg-white/10 p-4">
      <div className="text-xs text-slate-200">{label}</div>
      <div
        className={`mt-1 text-2xl font-black ${
          highlight ? "text-[#16B7C9]" : "text-white"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  return (
    <div className="rounded-2xl bg-[#16B7C9]/20 px-4 py-3 text-center">
      <div className="text-xs text-slate-100">BuyToRent Score</div>
      <div className="text-3xl font-black text-[#16B7C9]">{score}</div>
    </div>
  );
}

export function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-3">
      <div className="text-[11px] uppercase tracking-wide text-slate-300">
        {label}
      </div>
      <div className="mt-1 text-sm font-black text-white">{value}</div>
    </div>
  );
}
