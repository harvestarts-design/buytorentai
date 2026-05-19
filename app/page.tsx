import {
  ArrowRight,
  Bell,
  Calculator,
  CheckCircle2,
  Info,
  Search,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Button, Card, Metric, ScoreBadge } from "@/components/ui";
import { CTA } from "@/components/CTA";
import { formatCurrency } from "@/lib/format";

const earlyAccessFormUrl = "PASTE_YOUR_TALLY_FORM_LINK_HERE";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(22,183,201,0.16),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(6,42,85,0.08),_transparent_32%)]" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-20">
            <div>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#16B7C9]/30 bg-[#16B7C9]/10 px-4 py-2 text-sm font-semibold text-[#062A55]">
                <TrendingUp className="h-4 w-4 text-[#16B7C9]" />
                Long-term rental deal intelligence
              </div>

              <h1 className="text-5xl font-black tracking-tight text-[#062A55] sm:text-6xl lg:text-7xl">
                Buy low. <span className="text-[#16B7C9]">Rent high.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-700">
                BuyToRent AI helps rental investors find affordable markets,
                analyze gross monthly rent, and spot properties with strong rent
                potential before they buy.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/calculators">
                  Use calculators <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button href="/early-access">
                  Want more info? <Info className="ml-2 h-4 w-4" />
                </Button>
              </div>

              <div className="mt-8 grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-3">
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
        <div className="mb-10 max-w-3xl">
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
            href="/calculators"
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

      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <a
            href="/calculators"
            className="block transition hover:-translate-y-1"
          >
            <Card className="h-full p-8">
              <ShieldCheck className="mb-5 h-10 w-10 text-[#16B7C9]" />

              <h3 className="text-2xl font-black text-white">
                Built for new rental investors
              </h3>

              <p className="mt-4 text-slate-200">
                Instead of forcing you to piece together listings, rent comps,
                mortgage calculators, and spreadsheets, BuyToRent AI helps you
                compare price, rent potential, yield, and market risk in one
                place.
              </p>
            </Card>
          </a>

          <Card className="p-8">
            <h3 className="text-2xl font-black text-white">
              Join early access
            </h3>

            <p className="mt-3 text-slate-200">
              Get the first market reports, calculator access, and launch
              updates.
            </p>

            <div className="mt-6">
              <a
                href={earlyAccessFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#16B7C9] px-6 font-bold text-white transition hover:bg-[#119AA9]"
              >
                Get early access
              </a>
            </div>

            <p className="mt-3 text-xs text-slate-300">
              No spam. Just early product access and rental market insights.
            </p>
          </Card>
        </div>
      </section>

      <CTA />
    </>
  );
}
