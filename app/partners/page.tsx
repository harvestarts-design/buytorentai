import { ArrowRight, Building2, DollarSign, Handshake, LineChart, Users } from "lucide-react";
import { Button, Card } from "@/components/ui";

export default function PartnersPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
      <div className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#16B7C9]/30 bg-[#16B7C9]/10 px-4 py-2 text-sm text-[#062A55]">
          <Handshake className="h-4 w-4" /> For Partners
        </div>

        <h1 className="text-4xl font-black tracking-tight text-[#062A55] sm:text-5xl">
          Partner with BuyToRent AI.
        </h1>

        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
          BuyToRent AI is building the decision layer for long-term rental investors — helping users compare markets, analyze rental returns, estimate cash flow, and identify properties with stronger income potential before they buy.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-7">
          <LineChart className="mb-5 h-8 w-8 text-[#16B7C9]" />
          <h2 className="text-xl font-black text-white">The Opportunity</h2>
          <p className="mt-3 leading-7 text-slate-200">
            Rental investors are searching for better ways to find affordable markets, verify rent potential, and avoid bad deals. BuyToRent AI brings that decision process into one platform.
          </p>
        </Card>

        <Card className="p-7">
          <Users className="mb-5 h-8 w-8 text-[#16B7C9]" />
          <h2 className="text-xl font-black text-white">Who We Help</h2>
          <p className="mt-3 leading-7 text-slate-200">
            First-time investors, experienced landlords, agents, lenders, property managers, and real estate service providers who want better rental investment intelligence.
          </p>
        </Card>

        <Card className="p-7">
          <DollarSign className="mb-5 h-8 w-8 text-[#16B7C9]" />
          <h2 className="text-xl font-black text-white">Business Model</h2>
          <p className="mt-3 leading-7 text-slate-200">
            BuyToRent AI can grow through subscriptions, premium reports, deal alerts, lender referrals, agent partnerships, property manager leads, and investor-focused analytics.
          </p>
        </Card>
      </div>

      <Card className="mt-8 border-[#16B7C9]/20 bg-[#062A55] p-8 lg:p-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-bold text-[#16B7C9]">
              <Building2 className="h-4 w-4" /> Investor and partner interest
            </div>
            <h2 className="text-3xl font-black text-white">
              Interested in helping build the future of rental investment analysis?
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-slate-200">
              We’re looking to connect with early users, strategic partners, real estate professionals, lenders, property managers, data providers, and potential investors who believe rental investing needs better decision tools.
            </p>
          </div>

          <Button href="/early-access" className="shrink-0">
            Contact us <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </main>
  );
}
