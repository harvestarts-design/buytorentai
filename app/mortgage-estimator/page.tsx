"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Calculator,
  DollarSign,
  Home,
  Percent,
  Wallet,
} from "lucide-react";
import { Card, Metric } from "@/components/ui";
import { formatCurrency } from "@/lib/format";

function calculateMonthlyMortgagePayment(
  price: number,
  downPaymentPct: number,
  interestRate: number,
  years: number
) {
  const principal = price * (1 - downPaymentPct / 100);
  const monthlyRate = interestRate / 100 / 12;
  const payments = years * 12;

  if (!monthlyRate) return principal / payments;

  return (
    principal *
    ((monthlyRate * Math.pow(1 + monthlyRate, payments)) /
      (Math.pow(1 + monthlyRate, payments) - 1))
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

export default function CalculatorsPage() {
  const [homePrice, setHomePrice] = useState(250000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(7);
  const [loanYears, setLoanYears] = useState(30);
  const [monthlyTaxes, setMonthlyTaxes] = useState(350);
  const [monthlyInsurance, setMonthlyInsurance] = useState(175);
  const [monthlyHoa, setMonthlyHoa] = useState(0);

  const mortgageResults = useMemo(() => {
    const downPaymentAmount = homePrice * (downPaymentPct / 100);
    const loanAmount = homePrice - downPaymentAmount;
    const principalAndInterest = calculateMonthlyMortgagePayment(
      homePrice,
      downPaymentPct,
      interestRate,
      loanYears
    );

    const fullMonthlyPayment =
      principalAndInterest + monthlyTaxes + monthlyInsurance + monthlyHoa;

    const totalPrincipalAndInterest = principalAndInterest * loanYears * 12;
    const totalInterest = totalPrincipalAndInterest - loanAmount;

    return {
      downPaymentAmount,
      loanAmount,
      principalAndInterest,
      fullMonthlyPayment,
      totalInterest,
    };
  }, [
    homePrice,
    downPaymentPct,
    interestRate,
    loanYears,
    monthlyTaxes,
    monthlyInsurance,
    monthlyHoa,
  ]);

  const [grossMonthlyRent, setGrossMonthlyRent] = useState(1600);
  const [mortgagePayment, setMortgagePayment] = useState(1200);
  const [cashFlowTaxes, setCashFlowTaxes] = useState(250);
  const [cashFlowInsurance, setCashFlowInsurance] = useState(150);
  const [cashFlowHoa, setCashFlowHoa] = useState(0);
  const [maintenancePct, setMaintenancePct] = useState(8);
  const [vacancyPct, setVacancyPct] = useState(5);
  const [managementPct, setManagementPct] = useState(8);
  const [otherExpenses, setOtherExpenses] = useState(0);

  const cashFlowResults = useMemo(() => {
    const maintenanceReserve = grossMonthlyRent * (maintenancePct / 100);
    const vacancyReserve = grossMonthlyRent * (vacancyPct / 100);
    const managementFee = grossMonthlyRent * (managementPct / 100);

    const totalMonthlyExpenses =
      mortgagePayment +
      cashFlowTaxes +
      cashFlowInsurance +
      cashFlowHoa +
      maintenanceReserve +
      vacancyReserve +
      managementFee +
      otherExpenses;

    const estimatedMonthlyCashFlow = grossMonthlyRent - totalMonthlyExpenses;
    const estimatedAnnualCashFlow = estimatedMonthlyCashFlow * 12;
    const breakEvenRent = totalMonthlyExpenses;
    const expenseRatio =
      grossMonthlyRent > 0
        ? ((totalMonthlyExpenses - mortgagePayment) / grossMonthlyRent) * 100
        : 0;

    return {
      maintenanceReserve,
      vacancyReserve,
      managementFee,
      totalMonthlyExpenses,
      estimatedMonthlyCashFlow,
      estimatedAnnualCashFlow,
      breakEvenRent,
      expenseRatio,
    };
  }, [
    grossMonthlyRent,
    mortgagePayment,
    cashFlowTaxes,
    cashFlowInsurance,
    cashFlowHoa,
    maintenancePct,
    vacancyPct,
    managementPct,
    otherExpenses,
  ]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 text-[#062A55] lg:px-8 lg:py-14">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#16B7C9]/30 bg-[#16B7C9]/10 px-4 py-2 text-sm font-semibold text-[#062A55]">
          <Calculator className="h-4 w-4 text-[#16B7C9]" />
          BuyToRent AI Calculators
        </div>

        <h1 className="text-4xl font-black tracking-tight text-[#062A55] sm:text-5xl">
          Calculate the numbers before you buy.
        </h1>

        <p className="mt-3 max-w-3xl text-slate-700">
          Estimate mortgage payments, gross rental income, ownership expenses,
          and estimated monthly cash flow using your own assumptions.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6 lg:p-8">
          <div className="mb-5 flex items-center gap-3">
            <Home className="h-6 w-6 text-[#16B7C9]" />
            <h2 className="text-2xl font-black text-white">
              Mortgage Payment Estimator
            </h2>
          </div>

          <p className="mb-5 text-sm leading-6 text-slate-200">
            Estimate the monthly mortgage payment using purchase price, down
            payment, interest rate, loan term, taxes, insurance, and HOA.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Home price"
              value={homePrice}
              onChange={setHomePrice}
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

            <Input
              label="Loan term"
              value={loanYears}
              onChange={setLoanYears}
              suffix="yrs"
            />

            <Input
              label="Monthly property taxes"
              value={monthlyTaxes}
              onChange={setMonthlyTaxes}
              prefix="$"
            />

            <Input
              label="Monthly insurance"
              value={monthlyInsurance}
              onChange={setMonthlyInsurance}
              prefix="$"
            />

            <Input
              label="Monthly HOA"
              value={monthlyHoa}
              onChange={setMonthlyHoa}
              prefix="$"
            />
          </div>
        </Card>

        <Card className="p-6 lg:p-8">
          <div className="mb-5 flex items-center gap-3">
            <DollarSign className="h-6 w-6 text-[#16B7C9]" />
            <h2 className="text-2xl font-black text-white">
              Mortgage results
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Metric
              label="Full monthly payment"
              value={formatCurrency(mortgageResults.fullMonthlyPayment)}
              highlight
            />

            <Metric
              label="Principal & interest"
              value={formatCurrency(mortgageResults.principalAndInterest)}
            />

            <Metric
              label="Loan amount"
              value={formatCurrency(mortgageResults.loanAmount)}
            />

            <Metric
              label="Down payment amount"
              value={formatCurrency(mortgageResults.downPaymentAmount)}
            />

            <Metric
              label="Monthly taxes"
              value={formatCurrency(monthlyTaxes)}
            />

            <Metric
              label="Monthly insurance"
              value={formatCurrency(monthlyInsurance)}
            />

            <Metric label="Monthly HOA" value={formatCurrency(monthlyHoa)} />

            <Metric
              label="Total interest paid"
              value={formatCurrency(mortgageResults.totalInterest)}
            />
          </div>
        </Card>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="p-6 lg:p-8">
          <div className="mb-5 flex items-center gap-3">
            <Wallet className="h-6 w-6 text-[#16B7C9]" />
            <h2 className="text-2xl font-black text-white">
              Estimated Monthly Cash Flow Calculator
            </h2>
          </div>

          <p className="mb-5 text-sm leading-6 text-slate-200">
            Use this calculator only when you want to estimate cash flow based on
            your own financing, tax, insurance, maintenance, vacancy, management,
            HOA, and expense assumptions.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Gross monthly rent"
              value={grossMonthlyRent}
              onChange={setGrossMonthlyRent}
              prefix="$"
            />

            <Input
              label="Mortgage payment"
              value={mortgagePayment}
              onChange={setMortgagePayment}
              prefix="$"
            />

            <Input
              label="Monthly property taxes"
              value={cashFlowTaxes}
              onChange={setCashFlowTaxes}
              prefix="$"
            />

            <Input
              label="Monthly insurance"
              value={cashFlowInsurance}
              onChange={setCashFlowInsurance}
              prefix="$"
            />

            <Input
              label="Monthly HOA"
              value={cashFlowHoa}
              onChange={setCashFlowHoa}
              prefix="$"
            />

            <Input
              label="Maintenance reserve"
              value={maintenancePct}
              onChange={setMaintenancePct}
              suffix="%"
            />

            <Input
              label="Vacancy reserve"
              value={vacancyPct}
              onChange={setVacancyPct}
              suffix="%"
            />

            <Input
              label="Property management"
              value={managementPct}
              onChange={setManagementPct}
              suffix="%"
            />

            <Input
              label="Other monthly expenses"
              value={otherExpenses}
              onChange={setOtherExpenses}
              prefix="$"
            />
          </div>
        </Card>

        <Card className="p-6 lg:p-8">
          <div className="mb-5 flex items-center gap-3">
            <Percent className="h-6 w-6 text-[#16B7C9]" />
            <h2 className="text-2xl font-black text-white">
              Cash flow results
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Metric
              label="Estimated monthly cash flow"
              value={formatCurrency(cashFlowResults.estimatedMonthlyCashFlow)}
              highlight={cashFlowResults.estimatedMonthlyCashFlow > 0}
            />

            <Metric
              label="Estimated annual cash flow"
              value={formatCurrency(cashFlowResults.estimatedAnnualCashFlow)}
              highlight={cashFlowResults.estimatedAnnualCashFlow > 0}
            />

            <Metric
              label="Total monthly expenses"
              value={formatCurrency(cashFlowResults.totalMonthlyExpenses)}
            />

            <Metric
              label="Break-even rent"
              value={formatCurrency(cashFlowResults.breakEvenRent)}
            />

            <Metric
              label="Maintenance reserve"
              value={formatCurrency(cashFlowResults.maintenanceReserve)}
            />

            <Metric
              label="Vacancy reserve"
              value={formatCurrency(cashFlowResults.vacancyReserve)}
            />

            <Metric
              label="Property management"
              value={formatCurrency(cashFlowResults.managementFee)}
            />

            <Metric
              label="Expense ratio before mortgage"
              value={`${cashFlowResults.expenseRatio.toFixed(1)}%`}
            />
          </div>
        </Card>
      </section>

      <Card className="mt-8 p-6 lg:p-8">
        <div className="mb-4 flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 text-[#16B7C9]" />
          <h2 className="text-2xl font-black text-white">
            Important calculation note
          </h2>
        </div>

        <p className="leading-7 text-slate-200">
          Estimated monthly cash flow is based only on the assumptions entered.
          Actual results may vary based on financing, taxes, insurance,
          maintenance, repairs, vacancy, property management, HOA fees, lender
          terms, escrow changes, local market conditions, and other ownership
          costs.
        </p>
      </Card>
    </main>
  );
}
