"use client";

import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Calculator,
  DollarSign,
  Percent,
  Target,
} from "lucide-react";
import { analyzeDeal, getDealGrade } from "@/lib/calculations";
import { formatCurrency } from "@/lib/format";
import { Card, Metric, ScoreBadge } from "@/components/ui";

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
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-slate-200">{label}</span>

      <div className="flex items-center rounded-2xl bg-white px-3 text-[#062A55]">
        {prefix && <span className="text-slate-500">{prefix}</span>}

        <input
          type="number"
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="min-h-11 w-full bg-transparent px-2 outline-none"
        />

        {suffix && <span className="text-slate-500">{suffix}</span>}
      </div>
    </label>
  );
}

function ResultCard({
  icon,
  title,
  value,
  detail,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <Card className="p-6">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#16B7C9]/20 text-[#16B7C9]">
        {icon}
      </div>

      <div className="text-sm text-slate-200">{title}</div>
      <div className="mt-1 text-3xl font-black text-white">{value}</div>
      <div className="mt-3 text-sm leading-6 text-slate-200">{detail}</div>
    </Card>
  );
}

export function DealAnalyzer() {
  const [price, setPrice] = useState(150000);
  const [rent, setRent] = useState(1600);
  const [downPayment, setDownPayment] = useState(20);
  const [interest, setInterest] = useState(7);
  const [loanYears, setLoanYears] = useState(30);
  const [taxes, setTaxes] = useState(250);
  const [insurance, setInsurance] = useState(150);
  const [hoa, setHoa] = useState(0);
  const [vacancyPct, setVacancyPct] = useState(5);
  const [maintenancePct, setMaintenancePct] = useState(8);
  const [managementPct, setManagementPct] = useState(8);
  const [closingCosts, setClosingCosts] = useState(4500);
  const [repairBudget, setRepairBudget] = useState(8000);
  const [targetCashFlow, setTargetCashFlow] = useState(250);

  const r = useMemo(
    () =>
      analyzeDeal({
        price,
        rent,
        downPayment,
        interest,
        loanYears,
        taxes,
        insurance,
        hoa,
        vacancyPct,
        maintenancePct,
        managementPct,
        closingCosts,
        repairBudget,
        targetCashFlow,
      }),
    [
      price,
      rent,
      downPayment,
      interest,
      loanYears,
      taxes,
      insurance,
      hoa,
      vacancyPct,
      maintenancePct,
      managementPct,
      closingCosts,
      repairBudget,
      targetCashFlow,
    ]
  );

  const grade = getDealGrade(r.score);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 text-[#062A55] lg:px-8 lg:py-14">
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#16B7C9]/30 bg-[#16B7C9]/10 px-4 py-2 text-sm font-semibold text-[#062A55]">
            <Calculator className="h-4 w-4 text-[#16B7C9]" />
            BuyToRent AI Property Deal Analyzer
          </div>

          <h1 className="text-4xl font-black tracking-tight text-[#062A55] sm:text-5xl">
            Does this rental deal work?
          </h1>

          <p className="mt-3 max-w-3xl text-slate-700">
            Enter the property numbers and estimate cash flow, cap rate,
            cash-on-cash return, break-even rent, max offer price, and a simple
            deal grade.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl">
          <ScoreBadge score={r.score} />

          <div>
            <div className="text-sm text-slate-500">Deal grade</div>
            <div className="text-4xl font-black text-[#062A55]">{grade}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-6 lg:p-8">
          <h2 className="mb-5 text-2xl font-black text-white">
            Property assumptions
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Purchase price"
              value={price}
              onChange={setPrice}
              prefix="$"
            />

            <Input
              label="Estimated monthly rent"
              value={rent}
              onChange={setRent}
              prefix="$"
            />

            <Input
              label="Down payment"
              value={downPayment}
              onChange={setDownPayment}
              suffix="%"
            />

            <Input
              label="Interest rate"
              value={interest}
              onChange={setInterest}
              suffix="%"
              step="0.1"
            />

            <Input
              label="Loan term"
              value={loanYears}
              onChange={setLoanYears}
              suffix="yrs"
            />

            <Input
              label="Monthly property taxes"
              value={taxes}
              onChange={setTaxes}
              prefix="$"
            />

            <Input
              label="Monthly insurance"
              value={insurance}
              onChange={setInsurance}
              prefix="$"
            />

            <Input
              label="Monthly HOA"
              value={hoa}
              onChange={setHoa}
              prefix="$"
            />

            <Input
              label="Vacancy reserve"
              value={vacancyPct}
              onChange={setVacancyPct}
              suffix="%"
            />

            <Input
              label="Maintenance reserve"
              value={maintenancePct}
              onChange={setMaintenancePct}
              suffix="%"
            />

            <Input
              label="Property management"
              value={managementPct}
              onChange={setManagementPct}
              suffix="%"
            />

            <Input
              label="Target monthly cash flow"
              value={targetCashFlow}
              onChange={setTargetCashFlow}
              prefix="$"
            />

            <Input
              label="Closing costs"
              value={closingCosts}
              onChange={setClosingCosts}
              prefix="$"
            />

            <Input
              label="Initial repair budget"
              value={repairBudget}
              onChange={setRepairBudget}
              prefix="$"
            />
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6 lg:p-8">
            <h2 className="mb-5 text-2xl font-black text-white">
              Investment snapshot
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              <Metric
                label="Monthly cash flow"
                value={formatCurrency(r.cashFlow)}
                highlight={r.cashFlow > 0}
              />

              <Metric
                label="Annual cash flow"
                value={formatCurrency(r.cashFlow * 12)}
                highlight={r.cashFlow > 0}
              />

              <Metric label="Gross yield" value={`${r.grossYield.toFixed(1)}%`} />

              <Metric label="Cap rate" value={`${r.capRate.toFixed(1)}%`} />

              <Metric
                label="Cash-on-cash"
                value={`${r.cashOnCash.toFixed(1)}%`}
                highlight={r.cashOnCash > 8}
              />

              <Metric
                label="Break-even rent"
                value={formatCurrency(r.breakEvenRent)}
              />
            </div>
          </Card>

          <Card className="p-6 lg:p-8">
            <div className="mb-4 flex items-center gap-3">
              <Target className="h-6 w-6 text-[#16B7C9]" />
              <h2 className="text-2xl font-black text-white">Offer guidance</h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Metric
                label="Max offer for target cash flow"
                value={formatCurrency(r.maxOfferPrice)}
              />

              <Metric
                label="Total cash needed"
                value={formatCurrency(r.totalCashNeeded)}
              />
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <ResultCard
          icon={<DollarSign className="h-5 w-5" />}
          title="Monthly expenses"
          value={formatCurrency(r.totalExpenses)}
          detail={`Mortgage: ${formatCurrency(r.mortgage)} / month`}
        />

        <ResultCard
          icon={<Percent className="h-5 w-5" />}
          title="Rent-to-price ratio"
          value={`${r.rentToPrice.toFixed(2)}%`}
          detail={
            r.rentToPrice >= 1
              ? "Meets the 1% rule."
              : "Below the 1% rule."
          }
        />

        <ResultCard
          icon={<BarChart3 className="h-5 w-5" />}
          title="Net operating income"
          value={formatCurrency(r.noi)}
          detail="Annual income after operating expenses, before debt service."
        />
      </div>

      <Card className="mt-6 p-6 lg:p-8">
        <div className="mb-4 flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-[#16B7C9]" />
          <h2 className="text-2xl font-black text-white">
            BuyToRent AI readout
          </h2>
        </div>

        <p className="leading-7 text-slate-200">{r.readout}</p>
      </Card>
    </main>
  );
}
