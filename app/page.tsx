import Image from "next/image";
import {
  Bell,
  Calculator,
  CheckCircle2,
  Search,
  TrendingUp,
} from "lucide-react";
import { Card, Metric, ScoreBadge } from "@/components/ui";
import { formatCurrency } from "@/lib/format";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-white">
       <div className="relative mx-auto max-w-7xl px-6 pt-6 lg:px-8">
  <div className="relative h-[280px] w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">
    <Image
      src="/public/buytorent-banner.png"
      alt="BuyToRent AI banner"
      fill
      priority
      sizes="100vw"
      className="object-cover object-center"
    />
  </div>
</div>

        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(22,183,201,0.16),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(6,42,85,0.08),_transparent_32%)]" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-12 py-10 lg:grid-cols-2 lg:py-14">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#16B7C9]/30 bg-[#16B7C9]/10 px-4 py-2 text-sm font-semibold text-[#062A55]">
                <TrendingUp className="h-4 w-4 text-[#16B7C9]" />
                Long-term rental deal intelligence
              </div>

              <h1 className="text-5xl font-black tracking-tight text-[#062A55] sm:text-6xl lg:text-7xl">
                Buy low. <span className="text-[#16B7C9]">Rent high.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                Find better rental markets before you buy. BuyToRent AI helps
                long-term rental investors compare property prices, gross
                monthly rent, gross yield, market risk, rental demand, taxes,
                and investor assumptions in one place. Instead of bouncing
                between listings, rent comps, mortgage calculators, and
                spreadsheets, BuyToRent AI gives investors a faster way to
                identify high-potential rental markets and properties.
              </p>

              <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#16B7C9]" />
                  Market ranking
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#16B7C9]" />
                  Rent-to-price math
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#16B7C9]" />
                  Deal alerts
                </div>
              </div>

              </div>

            <Card className="p-6 backdrop-blur">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-200">
                    Sample property score
                  </div>
                  <div className="text-2xl font-bold text-white">
                    Detroit rental
                  </div>
                </div>

                <ScoreBadge score={87} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Metric label="Purchase price" value={formatCurrency(90000)} />

                <Metric
                  label="Gross monthly rent"
                  value={formatCurrency(1500)}
                  highlight
                />

                <Metric label="Gross yield" value="20.0%" highlight />

                <Metric label="Avg. tax rate" value="1.9%" />
              </div>

              <div className="mt-5 rounded-3xl bg-white/10 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-100">
                  <Calculator className="h-4 w-4 text-[#16B7C9]" />
                  What BuyToRent AI answers
                </div>

                <div className="space-y-2 text-sm text-slate-200">
                  <p>Is the rent strong enough compared to the purchase price?</p>
                  <p>What price should I offer to hit my target return?</p>
                  <p>Which markets have low prices and strong rents?</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 text-[#062A55] lg:px-8">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl font-black tracking-tight text-[#062A55] sm:text-4xl">
            Find markets where the numbers actually work.
          </h2>

          <p className="mt-4 text-slate-700">
            BuyToRent AI turns scattered home prices, rent estimates, expenses,
            and market risk into a simple investor score.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <a href="/markets" className="block transition hover:-translate-y-1">
            <Card className="h-full p-7">
              <Search className="mb-5 h-8 w-8 text-[#16B7C9]" />

              <h3 className="text-xl font-black text-white">Market Finder</h3>

              <p className="mt-3 leading-7 text-slate-200">
                Rank cities and ZIP codes by affordability, rent potential,
                gross yield, and rental demand.
              </p>
            </Card>
          </a>

          <a
            href="/mortgage-estimator"
            className="block transition hover:-translate-y-1"
          >
            <Card className="h-full p-7">
              <Calculator className="mb-5 h-8 w-8 text-[#16B7C9]" />

              <h3 className="text-xl font-black text-white">Calculators</h3>

              <p className="mt-3 leading-7 text-slate-200">
                Estimate mortgage costs, gross yield, rent-to-price potential,
                and property assumptions.
              </p>
            </Card>
          </a>

          <a href="/alerts" className="block transition hover:-translate-y-1">
            <Card className="h-full p-7">
              <Bell className="mb-5 h-8 w-8 text-[#16B7C9]" />

              <h3 className="text-xl font-black text-white">Deal Alerts</h3>

              <p className="mt-3 leading-7 text-slate-200">
                Get notified when a property matches your buy box, target rent,
                and rent-to-price criteria.
              </p>
            </Card>
          </a>
        </div>
      </section>
    </>
  );
}
