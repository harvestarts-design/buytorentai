import {
  ArrowRight,
  Bell,
  Bookmark,
  Download,
  LockKeyhole,
  Mail,
  UserPlus,
} from "lucide-react";
import { Button, Card, MiniMetric } from "@/components/ui";
import { formatCurrency } from "@/lib/format";

const savedSearches = [
  {
    name: "Cleveland cash-flow rentals",
    markets: "Cleveland, OH",
    maxPrice: 175000,
    minRent: 1400,
    minCashFlow: 200,
    matches: 12,
    frequency: "Daily",
  },
  {
    name: "Southern 1% rule deals",
    markets: "Birmingham, Memphis, Mobile",
    maxPrice: 200000,
    minRent: 1500,
    minCashFlow: 250,
    matches: 9,
    frequency: "Daily",
  },
  {
    name: "Duplex opportunities",
    markets: "All target markets",
    maxPrice: 225000,
    minRent: 1800,
    minCashFlow: 300,
    matches: 4,
    frequency: "Weekly",
  },
];

export default function EarlyAccessPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10 text-[#062A55] lg:px-8 lg:py-14">
      <div className="mb-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#16B7C9]/30 bg-[#16B7C9]/10 px-4 py-2 text-sm font-semibold text-[#062A55]">
            <UserPlus className="h-4 w-4" />
            BuyToRent AI Early Access
          </div>

          <h1 className="text-4xl font-black tracking-tight text-[#062A55] sm:text-5xl">
            Get more info and save your rental buy box.
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
            Early access gives you a first look at BuyToRent AI before the full
            platform launches. You’ll be able to test new tools, explore sample
            market rankings, analyze rental deals, and help shape upcoming
            features like rental comps, mortgage estimates, market scoring, and
            deal alerts. If you’re looking to invest in real estate or build
            income through the rental market, BuyToRent AI helps you move faster
            and make smarter decisions by comparing markets, estimating returns,
            identifying potential cash-flow opportunities, and filtering out
            deals that may not make financial sense. Early users may also
            receive beta access to new reports, priority feature updates, and
            discounted pricing when paid plans become available.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href="/alerts">
              Build my buy box <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              href="/markets"
              className="border border-[#16B7C9]/30 bg-white text-[#062A55] hover:bg-[#16B7C9]/10"
            >
              Explore markets
            </Button>
          </div>
        </div>

        <Card className="p-6 lg:p-8">
          <h2 className="text-2xl font-black text-white">
            Request early access
          </h2>

          <p className="mt-3 text-slate-200">
            Join the list to get product updates, sample reports, and first
            access to live rental deal data.
          </p>

          <form className="mt-6 grid gap-3">
            <input
              className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-[#062A55] outline-none"
              placeholder="Name"
            />

            <input
              className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-[#062A55] outline-none"
              placeholder="Email"
            />

            <select className="min-h-12 rounded-2xl border border-slate-200 bg-white px-4 text-[#062A55] outline-none">
              <option>I am a first-time investor</option>
              <option>I already own rentals</option>
              <option>I am an agent or lender</option>
              <option>I am a property manager</option>
            </select>

            <button
              type="button"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#16B7C9] px-6 font-bold text-white transition hover:bg-[#119AA9]"
            >
              <Mail className="mr-2 h-4 w-4" />
              Send me more info
            </button>
          </form>

          <p className="mt-3 text-xs text-slate-300">
            CTA copy: “Want more info? Click here to get early access.”
          </p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <Bookmark className="mb-4 h-7 w-7 text-[#16B7C9]" />
          <h3 className="text-xl font-black text-white">Save searches</h3>
          <p className="mt-2 text-slate-200">
            Users can save target markets, price limits, rent goals, and
            cash-flow requirements.
          </p>
        </Card>

        <Card className="p-6">
          <Bell className="mb-4 h-7 w-7 text-[#16B7C9]" />
          <h3 className="text-xl font-black text-white">Deal alerts</h3>
          <p className="mt-2 text-slate-200">
            BuyToRent AI can notify users when new listings match their buy box.
          </p>
        </Card>

        <Card className="p-6">
          <Download className="mb-4 h-7 w-7 text-[#16B7C9]" />
          <h3 className="text-xl font-black text-white">Reports</h3>
          <p className="mt-2 text-slate-200">
            Future upgrade: downloadable market reports and property
            underwriting summaries.
          </p>
        </Card>
      </div>

      <Card className="mt-6 p-6 lg:p-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-black text-white">
              Saved search dashboard
            </h2>
            <p className="mt-2 text-slate-200">
              This is the account area where users would manage saved searches
              and alerts.
            </p>
          </div>

          <Button href="/alerts">Create new alert</Button>
        </div>

        <div className="grid gap-4">
          {savedSearches.map((s) => (
            <Card
              key={s.name}
              className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 shadow-none"
            >
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                <div>
                  <h3 className="text-xl font-black text-white">{s.name}</h3>
                  <p className="mt-1 text-sm text-slate-300">{s.markets}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-5 lg:min-w-[680px]">
                  <MiniMetric
                    label="Max price"
                    value={formatCurrency(s.maxPrice)}
                  />
                  <MiniMetric
                    label="Min rent"
                    value={formatCurrency(s.minRent)}
                  />
                  <MiniMetric
                    label="Cash flow"
                    value={formatCurrency(s.minCashFlow)}
                  />
                  <MiniMetric label="Matches" value={s.matches} />
                  <MiniMetric label="Alerts" value={s.frequency} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      <Card className="mt-6 p-6 lg:p-8">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#16B7C9]">
              <LockKeyhole className="h-4 w-4" />
              Future account features
            </div>

            <h2 className="text-2xl font-black text-white">
              What users get after signing up
            </h2>

            <p className="mt-3 max-w-3xl leading-7 text-slate-200">
              Saved buy boxes, market watchlists, email alerts, downloadable
              reports, saved properties, and eventually live integrations with
              property/rent data providers.
            </p>
          </div>

          <Button href="/early-access">Want more info?</Button>
        </div>
      </Card>
    </main>
  );
}
