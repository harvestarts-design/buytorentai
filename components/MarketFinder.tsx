"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Bell,
  Building2,
  Calculator,
  DollarSign,
  Home,
  MapPin,
  Percent,
  Search,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { sampleMarkets } from "@/lib/sampleData";
import { formatCurrency } from "@/lib/format";
import { Button, Card, Metric, ScoreBadge } from "@/components/ui";

function calculateMonthlyPayment(
  price: number,
  downPaymentPct: number,
  interestRate: number,
  years = 30
) {
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

function toNumber(value: string) {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function Input({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = "1",
  onEnter,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  step?: string;
  onEnter?: () => void;
  placeholder?: string;
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
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onEnter) onEnter();
          }}
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
  activePurchasePrice,
  activeDesiredRent,
  activeMinimumYield,
}: {
  marketPrice: number;
  marketRent: number;
  marketYield: number;
  baseScore: number;
  activePurchasePrice: number | null;
  activeDesiredRent: number | null;
  activeMinimumYield: number | null;
}) {
  let score = baseScore * 0.35;

  if (activePurchasePrice) {
    const affordabilityScore =
      marketPrice <= activePurchasePrice
        ? 25
        : Math.max(
            0,
            25 - ((marketPrice - activePurchasePrice) / activePurchasePrice) * 50
          );

    score += affordabilityScore;
  }

  if (activeDesiredRent) {
    const rentTargetScore =
      marketRent >= activeDesiredRent
        ? 25
        : Math.max(
            0,
            25 - ((activeDesiredRent - marketRent) / activeDesiredRent) * 50
          );

    score += rentTargetScore;
  }

  if (activeMinimumYield) {
    const yieldScore =
      marketYield >= activeMinimumYield
        ? 20
        : Math.max(
            0,
            20 - ((activeMinimumYield - marketYield) / activeMinimumYield) * 50
          );

    score += yieldScore;
  } else {
    score += Math.min(15, marketYield * 1.2);
  }

  return Math.round(Math.max(0, Math.min(100, score)));
}

export function MarketFinder() {
  const [purchasePriceInput, setPurchasePriceInput] = useState("");
  const [downPaymentInput, setDownPaymentInput] = useState("");
  const [interestRateInput, setInterestRateInput] = useState("");

  const [rentInput, setRentInput] = useState("");
  const [minimumYieldInput, setMinimumYieldInput] = useState("");

  const [activeSearchType, setActiveSearchType] = useState<
    "default" | "purchase" | "rent"
  >("default");

  const [activePurchasePrice, setActivePurchasePrice] = useState<number | null>(
    null
  );
  const [activeDownPayment, setActiveDownPayment] = useState<number | null>(
    null
  );
  const [activeInterestRate, setActiveInterestRate] = useState<number | null>(
    null
  );
  const [activeDesiredRent, setActiveDesiredRent] = useState<number | null>(
    null
  );
  const [activeMinimumYield, setActiveMinimumYield] = useState<number | null>(
    null
  );

  function runPurchaseSearch() {
    const purchasePrice = toNumber(purchasePriceInput);
    const downPayment = toNumber(downPaymentInput) ?? 20;
    const interestRate = toNumber(interestRateInput) ?? 7;

    if (!purchasePrice) return;

    setActiveSearchType("purchase");
    setActivePurchasePrice(purchasePrice);
    setActiveDownPayment(downPayment);
    setActiveInterestRate(interestRate);

    setActiveDesiredRent(null);
    setActiveMinimumYield(null);
  }

  function runRentSearch() {
    const desiredRent = toNumber(rentInput);
    const minimumYield = toNumber(minimumYieldInput);

    if (!desiredRent) return;

    setActiveSearchType("rent");
    setActiveDesiredRent(desiredRent);
    setActiveMinimumYield(minimumYield);

    setActivePurchasePrice(null);
    setActiveDownPayment(null);
    setActiveInterestRate(null);
  }

  function resetSearch() {
    setPurchasePriceInput("");
    setDownPaymentInput("");
    setInterestRateInput("");
    setRentInput("");
    setMinimumYieldInput("");

    setActiveSearchType("default");
    setActivePurchasePrice(null);
    setActiveDownPayment(null);
    setActiveInterestRate(null);
    setActiveDesiredRent(null);
    setActiveMinimumYield(null);
  }

  const monthlyPayment = useMemo(() => {
    if (!activePurchasePrice) return null;

    return calculateMonthlyPayment(
      activePurchasePrice,
      activeDownPayment ?? 20,
      activeInterestRate ?? 7
    );
  }, [activePurchasePrice, activeDownPayment, activeInterestRate]);

  const downPaymentAmount =
    activePurchasePrice && activeDownPayment
      ? activePurchasePrice * (activeDownPayment / 100)
      : activePurchasePrice
      ? activePurchasePrice * 0.2
      : null;

  const loanAmount =
    activePurchasePrice && downPaymentAmount !== null
      ? activePurchasePrice - downPaymentAmount
      : null;

  const filteredAndRankedMarkets = useMemo(() => {
    return sampleMarkets
      .map((market) => {
        const personalizedScore = calculateMarketFitScore({
          marketPrice: market.price,
          marketRent: market.rent,
          marketYield: market.yield,
          baseScore: market.score,
          activePurchasePrice,
          activeDesiredRent,
          activeMinimumYield,
        });

        const estimatedCashBeforeOtherExpenses =
          monthlyPayment !== null ? market.rent - monthlyPayment : null;

        return {
          ...market,
          personalizedScore,
          estimatedCashBeforeOtherExpenses,
          purchaseMatch:
            activePurchasePrice === null || market.price <= activePurchasePrice,
          rentMatch:
            activeDesiredRent === null || market.rent >= activeDesiredRent,
          yieldMatch:
            activeMinimumYield === null || market.yield >= activeMinimumYield,
        };
      })
      .filter((market) => {
        if (activeSearchType === "purchase") {
          return activePurchasePrice === null || market.price <= activePurchasePrice;
        }

        if (activeSearchType === "rent") {
          const rentMatches =
            activeDesiredRent === null || market.rent >= activeDesiredRent;

          const yieldMatches =
            activeMinimumYield === null || market.yield >= activeMinimumYield;

          return rentMatches && yieldMatches;
        }

        return true;
      })
      .sort((a, b) => b.personalizedScore - a.personalizedScore);
  }, [
    activeSearchType,
    activePurchasePrice,
    activeDesiredRent,
    activeMinimumYield,
    monthlyPayment,
  ]);

  const topMarket = filteredAndRankedMarkets[0];

  const searchDescription =
    activeSearchType === "purchase" && activePurchasePrice
      ? `Showing markets with median purchase prices at or below ${formatCurrency(
          activePurchasePrice
        )}. Down payment and interest rate refine the estimated mortgage impact.`
      : activeSearchType === "rent" && activeDesiredRent
      ? `Showing markets with estimated monthly rent at or above ${formatCurrency(
          activeDesiredRent
        )}${
          activeMinimumYield
            ? ` and gross yield at or above ${activeMinimumYield.toFixed(1)}%`
            : ""
        }.`
      : "Showing all sample markets. Use either purchase assumptions or rental income target to personalize the results.";

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
            Compare rental markets by purchase price, estimated rent, gross
            yield, vacancy risk, renter demand, and BuyToRent Score.
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
              <h2 className="text-2xl font-black text-white">
                Purchase assumptions
              </h2>
            </div>

            <p className="mb-5 text-sm leading-6 text-stone-400">
              Enter a desired or maximum purchase price to find markets that fit
              your budget. Down payment and interest rate are optional and help
              estimate mortgage impact.
            </p>

            <div className="grid gap-4">
              <Input
                label="Desired / max purchase price"
                value={purchasePriceInput}
                onChange={setPurchasePriceInput}
                onEnter={runPurchaseSearch}
                prefix="$"
                placeholder="Example: 200000"
              />

              <Input
                label="Down payment optional"
                value={downPaymentInput}
                onChange={setDownPaymentInput}
                onEnter={runPurchaseSearch}
                suffix="%"
                placeholder="20"
              />

              <Input
                label="Interest rate optional"
                value={interestRateInput}
                onChange={setInterestRateInput}
                onEnter={runPurchaseSearch}
                suffix="%"
                step="0.1"
                placeholder="7"
              />
            </div>

            <button
              onClick={runPurchaseSearch}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-orange-500 px-6 font-bold text-white transition hover:bg-orange-600"
            >
              <Search className="mr-2 h-4 w-4" />
              Search by purchase price
            </button>

            {activeSearchType === "purchase" && activePurchasePrice && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Metric
                  label="Active max price"
                  value={formatCurrency(activePurchasePrice)}
                />

                <Metric
                  label="Down payment"
                  value={
                    downPaymentAmount !== null
                      ? formatCurrency(downPaymentAmount)
                      : "-"
                  }
                />

                <Metric
                  label="Loan amount"
                  value={loanAmount !== null ? formatCurrency(loanAmount) : "-"}
                />

                <Metric
                  label="Est. mortgage"
                  value={
                    monthlyPayment !== null
                      ? formatCurrency(monthlyPayment)
                      : "-"
                  }
                />
              </div>
            )}
          </Card>

          <Card className="border-orange-400/20 bg-orange-400/10 p-6 lg:p-8">
            <div className="mb-5 flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-orange-300" />
              <h2 className="text-2xl font-black text-white">
                Rental income target
              </h2>
            </div>

            <p className="mb-5 text-sm leading-6 text-stone-300">
              Enter your desired monthly rental income to find markets with
              rents at or above that target. Minimum gross yield is optional and
              further refines the output.
            </p>

            <div className="grid gap-4">
              <Input
                label="Desired monthly rental income"
                value={rentInput}
                onChange={setRentInput}
                onEnter={runRentSearch}
                prefix="$"
                placeholder="Example: 1500"
              />

              <Input
                label="Minimum gross yield optional"
                value={minimumYieldInput}
                onChange={setMinimumYieldInput}
                onEnter={runRentSearch}
                suffix="%"
                step="0.1"
                placeholder="Optional"
              />
            </div>

            <button
              onClick={runRentSearch}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-orange-500 px-6 font-bold text-white transition hover:bg-orange-600"
            >
              <Search className="mr-2 h-4 w-4" />
              Search by rental income
            </button>

            {activeSearchType === "rent" && activeDesiredRent && (
              <div className="mt-6 rounded-3xl bg-stone-950/70 p-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-100">
                  <Calculator className="h-4 w-4 text-orange-300" />
                  Active rental search
                </div>

                <p className="text-sm leading-6 text-stone-300">
                  Showing markets with estimated monthly rent at or above{" "}
                  <span className="font-bold text-white">
                    {formatCurrency(activeDesiredRent)}
                  </span>
                  {activeMinimumYield ? (
                    <>
                      {" "}
                      and gross yield of at least{" "}
                      <span className="font-bold text-white">
                        {activeMinimumYield.toFixed(1)}%
                      </span>
                    </>
                  ) : (
                    ". Minimum gross yield was not used."
                  )}
                </p>
              </div>
            )}
          </Card>

          <Card className="p-6 lg:p-8">
            <div className="mb-3 flex items-center gap-3">
              <Percent className="h-6 w-6 text-orange-300" />
              <h2 className="text-2xl font-black text-white">
                Matching markets
              </h2>
            </div>

            <div className="text-5xl font-black text-white">
              {filteredAndRankedMarkets.length}
            </div>

            <p className="mt-3 text-sm leading-6 text-stone-300">
              {searchDescription}
            </p>

            {activeSearchType !== "default" && (
              <button
                onClick={resetSearch}
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Reset search
              </button>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          {topMarket ? (
            <Card className="border-orange-400/20 bg-orange-400/10 p-6 lg:p-8">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                <div>
                  <div className="mb-2 text-sm text-orange-100">
                    Top personalized match
                  </div>

                  <h2 className="text-3xl font-black text-white">
                    {topMarket.market}
                  </h2>

                  <p className="mt-3 max-w-2xl leading-7 text-stone-300">
                    {topMarket.note}
                  </p>
                </div>

                <ScoreBadge score={topMarket.personalizedScore} />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                <Metric
                  label="Median price"
                  value={formatCurrency(topMarket.price)}
                />

                <Metric
                  label="Est. rent"
                  value={formatCurrency(topMarket.rent)}
                />

                <Metric
                  label="Gross yield"
                  value={`${topMarket.yield.toFixed(1)}%`}
                  highlight
                />

                <Metric
                  label={monthlyPayment !== null ? "Rent minus mortgage" : "Demand"}
                  value={
                    monthlyPayment !== null &&
                    topMarket.estimatedCashBeforeOtherExpenses !== null
                      ? formatCurrency(topMarket.estimatedCashBeforeOtherExpenses)
                      : topMarket.renterDemand
                  }
                  highlight={
                    monthlyPayment !== null &&
                    topMarket.estimatedCashBeforeOtherExpenses !== null &&
                    topMarket.estimatedCashBeforeOtherExpenses > 0
                  }
                />
              </div>
            </Card>
          ) : (
            <Card className="border-red-400/20 bg-red-400/10 p-6 lg:p-8">
              <h2 className="text-2xl font-black text-white">
                No markets match yet
              </h2>

              <p className="mt-3 text-stone-300">
                Try increasing your purchase price, lowering your desired rent,
                or removing your minimum gross yield.
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
                    <tr
                      key={row.market}
                      className="border-t border-white/10 text-stone-100"
                    >
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
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-stone-400"
                      >
                        No markets match your current search.
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
            Users can search by purchase price or rental income independently.
            Additional inputs refine the output.
          </p>
        </Card>

        <Card className="p-6">
          <ShieldCheck className="mb-4 h-7 w-7 text-orange-300" />

          <h3 className="text-xl font-black">Risk layer</h3>

          <p className="mt-2 text-stone-300">
            Cheap properties can hide vacancy, repairs, taxes, insurance, or
            resale risk.
          </p>
        </Card>

        <Card className="p-6">
          <Bell className="mb-4 h-7 w-7 text-orange-300" />

          <h3 className="text-xl font-black">Deal alerts</h3>

          <p className="mt-2 text-stone-300">
            Users can save a buy box and get notified when matching properties
            appear.
          </p>
        </Card>
      </div>
    </main>
  );
}
