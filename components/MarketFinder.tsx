"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Bell, Building2, Calculator, DollarSign, Home, MapPin, Percent, ShieldCheck, TrendingUp } from "lucide-react";
import { sampleMarkets } from "@/lib/sampleData";
import { formatCurrency } from "@/lib/format";
import { Button, Card, Metric, ScoreBadge } from "@/components/ui";

function calculateMonthlyPayment(price: number, downPaymentPct: number, interestRate: number, years = 30) {
  const principal = price * (1 - downPaymentPct / 100);
  const monthlyRate = interestRate / 100 / 12;
  const payments = years * 12;

  if (!monthlyRate) return principal / payments;

  return (
    principal *
    (monthlyRate * Math.pow(1 + monthlyRate, payments)) /
    (Math.pow(1 + monthlyRate, payments) - 1)
  );
}

function Input({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = "1",
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-stone-400">{label}</span>
      <div className="flex items-center rounded-2xl bg-white px-3 text-stone-950">
        {prefix && <span className="text-stone-500">{prefix}</span>}
        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="min-h-11 w-full bg-transparent px-2 outline-none"
        />
        {suffix && <span className="text-stone-500">{suffix}</span>}
      </div>
    </label>
  );
}

function calculateMarketFitScore({
  marketPrice,
  marketRent,
  marketYield,
  baseScore,
  targetPurchasePrice,
  desiredRent,
}: {
  marketPrice: number;
  marketRent: number;
  marketYield: number;
  baseScore: number;
  targetPurchasePrice: number;
  desiredRent: number;
}) {
  const affordabilityScore =
    marketPrice <= targetPurchasePrice
      ? 25
      : Math.max(0, 25 - ((marketPrice - targetPurchasePrice) / targetPurchasePrice) * 50);

  const rentTargetScore =
    marketRent >= desiredRent
      ? 25
      : Math.max(0, 25 - ((desiredRent - marketRent) / desiredRent) * 50);

  const yieldScore = Math.min(25, marketYield * 1.8);

  const baseMarketQuality = baseScore * 0.25;

  return Math.round(
    Math.max(0, Math.min(100, affordabilityScore + rentTargetScore + yieldScore + baseMarketQuality))
  );
}

export function MarketFinder() {
  const [targetPurchasePrice, setTargetPurchasePrice] = useState(200000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(7);
  const [desiredRent, setDesiredRent] = useState(1500);
  const [minimumYield, setMinimumYield] = useState(10);

  const monthlyPayment = useMemo(() => {
    return calculateMonthlyPayment(targetPurchasePrice, downPaymentPct, interestRate);
  }, [targetPurchasePrice, downPaymentPct, interestRate]);

  const downPaymentAmount = targetPurchasePrice * (downPaymentPct / 100);
  const loanAmount = targetPurchasePrice - downPaymentAmount;

const filteredAndRankedMarkets = useMemo(() => {
  return sampleMarkets
    .map((market) => {
      const personalizedScore = calculateMarketFitScore({
        marketPrice: market.price,
        marketRent: market.rent,
        marketYield: market.yield,
        baseScore: market.score,
        targetPurchasePrice,
        desiredRent,
      });

      const estimatedCashBeforeOtherExpenses = market.rent - monthlyPayment;

      return {
        ...market,
        personalizedScore,
        estimatedCashBeforeOtherExpenses,
        purchaseMatch: market.price <= targetPurchasePrice,
        rentMatch: market.rent >= desiredRent,
        yieldMatch: market.yield >= minimumYield,
      };
    })
    .filter((market) => market.price <= targetPurchasePrice)
    .filter((market) => market.rent >= desiredRent)
    .filter((market) => market.yield >= minimumYield)
    .sort((a, b) => b.personalizedScore - a.personalizedScore);
}, [targetPurchasePrice, desiredRent, minimumYield, monthlyPayment]);

  const topMarket = filteredAndRankedMarkets[0];

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-sm text-orange-100">
            <MapPin className="h-4 w-4" /> BuyToRent AI Market Finder
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Find low-price, high-rent markets.
          </h1>
          <p className="mt-3 max-w-3xl text-stone-300">
            Compare rental markets by purchase price, estimated rent, gross yield, vacancy risk, renter demand, and BuyToRent Score.
          </p>
        </div>

        <Button href="/analyzer">
          Analyze a property <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <Card className="p-6 lg:p-8">
            <div className="mb-5 flex items-center gap-3">
              <Home className="h-6 w-6 text-orange-300" />
              <h2 className="text-2xl font-black text-white">Purchase assumptions</h2>
            </div>

            <div className="grid gap-4">
              <Input
                label="Desired / max purchase price"
                value={targetPurchasePrice}
                onChange={setTargetPurchasePrice}
                prefix="$"
              />

              <Input
                label="Down payment"
                value={downPaymentPct}
                onChange={setDownPaymentPct}
                suffix="%"
              />

              <Input
                label="Interest rate"
                value={interestRate}
                onChange={setInterestRate}
                suffix="%"
                step="0.1"
              />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Metric label="Down payment" value={formatCurrency(downPaymentAmount)} />
              <Metric label="Loan amount" value={formatCurrency(loanAmount)} />
              <Metric label="Est. mortgage" value={formatCurrency(monthlyPayment)} />
              <Metric label="Loan term" value="30 yrs" />
            </div>
          </Card>

          <Card className="border-orange-400/20 bg-orange-400/10 p-6 lg:p-8">
            <div className="mb-5 flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-orange-300" />
              <h2 className="text-2xl font-black text-white">Rental income target</h2>
            </div>

            <div className="grid gap-4">
              <Input
                label="Desired monthly rental income"
                value={desiredRent}
                onChange={setDesiredRent}
                prefix="$"
              />

              <Input
                label="Minimum gross yield"
                value={minimumYield}
                onChange={setMinimumYield}
                suffix="%"
                step="0.1"
              />
            </div>

            <div className="mt-6 rounded-3xl bg-stone-950/70 p-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-100">
                <Calculator className="h-4 w-4 text-orange-300" />
                Market Finder rule
              </div>

              <p className="text-sm leading-6 text-stone-300">
                Show markets where estimated rents are close to or above{" "}
                <span className="font-bold text-white">{formatCurrency(desiredRent)}</span>, median prices are close to or below{" "}
                <span className="font-bold text-white">{formatCurrency(targetPurchasePrice)}</span>, and gross yield is at least{" "}
                <span className="font-bold text-white">{minimumYield.toFixed(1)}%</span>.
              </p>
            </div>
          </Card>

          <Card className="p-6 lg:p-8">
            <div className="mb-3 flex items-center gap-3">
              <Percent className="h-6 w-6 text-orange-300" />
              <h2 className="text-2xl font-black text-white">Matching markets</h2>
            </div>

            <div className="text-5xl font-black text-white">
              {filteredAndRankedMarkets.length}
            </div>

            <p className="mt-3 text-sm leading-6 text-stone-300">
              Rankings are personalized based on your purchase assumptions, target rent, and minimum yield.
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          {topMarket ? (
            <Card className="border-orange-400/20 bg-orange-400/10 p-6 lg:p-8">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                <div>
                  <div className="mb-2 text-sm text-orange-100">Top personalized match</div>
                  <h2 className="text-3xl font-black text-white">{topMarket.market}</h2>
                  <p className="mt-3 max-w-2xl leading-7 text-stone-300">{topMarket.note}</p>
                </div>

                <ScoreBadge score={topMarket.personalizedScore} />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                <Metric label="Median price" value={formatCurrency(topMarket.price)} />
                <Metric label="Est. rent" value={formatCurrency(topMarket.rent)} />
                <Metric label="Gross yield" value={`${topMarket.yield.toFixed(1)}%`} highlight />
                <Metric label="Cash before expenses" value={formatCurrency(topMarket.estimatedCashBeforeOtherExpenses)} highlight={topMarket.estimatedCashBeforeOtherExpenses > 0} />
              </div>
            </Card>
          ) : (
            <Card className="border-red-400/20 bg-red-400/10 p-6 lg:p-8">
              <h2 className="text-2xl font-black text-white">No markets match yet</h2>
              <p className="mt-3 text-stone-300">
                Try increasing your purchase price, lowering your desired rent, or lowering your minimum gross yield.
              </p>
            </Card>
          )}

          <Card className="p-6 lg:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Building2 className="h-6 w-6 text-orange-300" />
              <h2 className="text-2xl font-black text-white">Market rankings</h2>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/10 text-stone-300">
                  <tr>
                    <th className="px-4 py-3">Market</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Rent</th>
                    <th className="px-4 py-3">Yield</th>
                    <th className="px-4 py-3">Demand</th>
                    <th className="px-4 py-3">Risk</th>
                    <th className="px-4 py-3">Score</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAndRankedMarkets.map((row) => (
                    <tr key={row.market} className="border-t border-white/10 text-stone-100">
                      <td className="px-4 py-4 font-semibold">
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-orange-400" />
                          {row.market}
                        </span>
                      </td>

                      <td className="px-4 py-4">{formatCurrency(row.price)}</td>
                      <td className="px-4 py-4">{formatCurrency(row.rent)}</td>
                      <td className="px-4 py-4">{row.yield.toFixed(1)}%</td>
                      <td className="px-4 py-4">{row.renterDemand}</td>
                      <td className="px-4 py-4">{row.risk}</td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-green-400/20 px-3 py-1 font-bold text-green-300">
                          {row.personalizedScore}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filteredAndRankedMarkets.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-stone-400">
                        No markets match your current assumptions.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <TrendingUp className="mb-4 h-7 w-7 text-orange-300" />
          <h3 className="text-xl font-black">Personalized rankings</h3>
          <p className="mt-2 text-stone-300">
            Markets are ranked based on your purchase price, financing assumptions, desired rent, and minimum yield.
          </p>
        </Card>

        <Card className="p-6">
          <ShieldCheck className="mb-4 h-7 w-7 text-orange-300" />
          <h3 className="text-xl font-black">Risk layer</h3>
          <p className="mt-2 text-stone-300">
            Cheap properties can hide vacancy, repairs, taxes, insurance, or resale risk.
          </p>
        </Card>

        <Card className="p-6">
          <Bell className="mb-4 h-7 w-7 text-orange-300" />
          <h3 className="text-xl font-black">Deal alerts</h3>
          <p className="mt-2 text-stone-300">
            Users can save a buy box and get notified when matching properties appear.
          </p>
        </Card>
      </div>
    </main>
  );
}
