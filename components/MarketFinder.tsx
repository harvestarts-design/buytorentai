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
import { sampleSubmarkets } from "@/lib/sampleSubmarkets";
import { sampleListings } from "@/lib/sampleListings";
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

function matchesPriceBucket(price: number, bucket: string) {
  if (bucket === "Any") return true;
  if (bucket === "<$100K") return price < 100000;
  if (bucket === "$101K–$200K") return price >= 101000 && price <= 200000;
  if (bucket === "$201K–$300K") return price >= 201000 && price <= 300000;
  if (bucket === "$301K–$500K") return price >= 301000 && price <= 500000;
  if (bucket === ">$501K") return price >= 501000;
  return true;
}

function normalizePropertyType(type: string) {
  if (type === "Condo") return "Apartment/Condo";
  if (type === "Duplex") return "Multi unit";
  return type;
}

function propertyTypeMatches(types: string[], selectedType: string) {
  if (selectedType === "Any") return true;

  return types.some((type) => normalizePropertyType(type) === selectedType);
}

function getLayerValue(item: any, layer: string) {
  if (layer === "buyToRentScore") return item.buyToRentScore ?? item.score ?? 0;
  if (layer === "homePrice") return item.medianHomePrice ?? item.price ?? 0;
  if (layer === "locationScore") return item.locationScore ?? 0;
  if (layer === "propertyRatingScore") return item.propertyRatingScore ?? 0;
  if (layer === "listingCount")
    return item.listingCount ?? item.listingCountLtm ?? 0;
  if (layer === "grossMonthlyRent") return item.grossMonthlyRent ?? item.rent ?? 0;
  if (layer === "grossYield") return item.grossYield ?? item.yield ?? 0;
  if (layer === "rentalRevenuePotential")
    return item.rentalRevenuePotential ?? 0;

  return item.buyToRentScore ?? item.score ?? 0;
}

function getLayerLabel(layer: string) {
  if (layer === "buyToRentScore") return "BuyToRent Score";
  if (layer === "homePrice") return "Home Price";
  if (layer === "locationScore") return "Location Score";
  if (layer === "propertyRatingScore") return "Property Rating Score";
  if (layer === "listingCount") return "Listing Count";
  if (layer === "grossMonthlyRent") return "Gross Monthly Rent";
  if (layer === "grossYield") return "Gross Yield";
  if (layer === "rentalRevenuePotential") return "Rental Revenue Potential";

  return "BuyToRent Score";
}

function formatLayerValue(value: number, layer: string) {
  if (layer === "homePrice") return formatCurrency(value);
  if (layer === "grossMonthlyRent") return formatCurrency(value);
  if (layer === "grossYield") return `${value.toFixed(1)}%`;
  if (layer === "listingCount") return `${value}`;
  return `${value}`;
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
      <span className="mb-1 block text-xs text-slate-200">{label}</span>

      <div className="flex items-center rounded-2xl bg-white px-3 text-[#062A55]">
        {prefix && <span className="text-slate-500">{prefix}</span>}

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

        {suffix && <span className="text-slate-500">{suffix}</span>}
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

  const [selectedPropertyType, setSelectedPropertyType] = useState("Any");
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [bathrooms, setBathrooms] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceSlider, setPriceSlider] = useState(1000000);
  const [selectedPriceBucket, setSelectedPriceBucket] = useState("Any");
  const [heatMapLayer, setHeatMapLayer] = useState("buyToRentScore");

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

    setSelectedPropertyType("Any");
    setBedrooms(null);
    setBathrooms(null);
    setMinPrice("");
    setMaxPrice("");
    setPriceSlider(1000000);
    setSelectedPriceBucket("Any");
    setHeatMapLayer("buyToRentScore");

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

        return {
          ...market,
          personalizedScore,
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
  ]);

  const filteredSubmarkets = useMemo(() => {
    const min = toNumber(minPrice);
    const max = toNumber(maxPrice);

    return sampleSubmarkets
      .filter((submarket) => {
        const matchesPropertyType = propertyTypeMatches(
          submarket.propertyTypes,
          selectedPropertyType
        );

        const matchesBedrooms =
          bedrooms === null ||
          submarket.bedrooms.some((bedroom) => bedroom >= bedrooms);

        const matchesBathrooms =
          bathrooms === null ||
          submarket.bathrooms.some((bathroom) => bathroom >= bathrooms);

        const matchesMinPrice = min === null || submarket.medianHomePrice >= min;
        const matchesMaxPrice = max === null || submarket.medianHomePrice <= max;
        const matchesSlider = submarket.medianHomePrice <= priceSlider;
        const matchesBucket = matchesPriceBucket(
          submarket.medianHomePrice,
          selectedPriceBucket
        );

        const matchesPurchaseSearch =
          activePurchasePrice === null ||
          submarket.medianHomePrice <= activePurchasePrice;

        const matchesRentSearch =
          activeDesiredRent === null ||
          submarket.grossMonthlyRent >= activeDesiredRent;

        const matchesYieldSearch =
          activeMinimumYield === null ||
          submarket.grossYield >= activeMinimumYield;

        return (
          matchesPropertyType &&
          matchesBedrooms &&
          matchesBathrooms &&
          matchesMinPrice &&
          matchesMaxPrice &&
          matchesSlider &&
          matchesBucket &&
          matchesPurchaseSearch &&
          matchesRentSearch &&
          matchesYieldSearch
        );
      })
      .sort((a, b) => b.buyToRentScore - a.buyToRentScore);
  }, [
    selectedPropertyType,
    bedrooms,
    bathrooms,
    minPrice,
    maxPrice,
    priceSlider,
    selectedPriceBucket,
    activePurchasePrice,
    activeDesiredRent,
    activeMinimumYield,
  ]);

  const filteredListings = useMemo(() => {
    const min = toNumber(minPrice);
    const max = toNumber(maxPrice);
    const matchingSubmarketNames = filteredSubmarkets.map(
      (item) => item.submarket
    );

    return sampleListings
      .filter((listing) => {
        const matchesSubmarket =
          matchingSubmarketNames.length === 0 ||
          matchingSubmarketNames.includes(listing.submarket);

        const matchesPropertyType =
          selectedPropertyType === "Any" ||
          normalizePropertyType(listing.propertyType) === selectedPropertyType;

        const matchesBedrooms = bedrooms === null || listing.beds >= bedrooms;
        const matchesBathrooms = bathrooms === null || listing.baths >= bathrooms;

        const matchesMinPrice = min === null || listing.price >= min;
        const matchesMaxPrice = max === null || listing.price <= max;
        const matchesSlider = listing.price <= priceSlider;
        const matchesBucket = matchesPriceBucket(
          listing.price,
          selectedPriceBucket
        );

        const matchesPurchaseSearch =
          activePurchasePrice === null || listing.price <= activePurchasePrice;

        const matchesRentSearch =
          activeDesiredRent === null ||
          listing.estimatedGrossMonthlyRent >= activeDesiredRent;

        const matchesYieldSearch =
          activeMinimumYield === null ||
          listing.grossYield >= activeMinimumYield;

        return (
          matchesSubmarket &&
          matchesPropertyType &&
          matchesBedrooms &&
          matchesBathrooms &&
          matchesMinPrice &&
          matchesMaxPrice &&
          matchesSlider &&
          matchesBucket &&
          matchesPurchaseSearch &&
          matchesRentSearch &&
          matchesYieldSearch
        );
      })
      .sort((a, b) => b.buyToRentScore - a.buyToRentScore);
  }, [
    filteredSubmarkets,
    selectedPropertyType,
    bedrooms,
    bathrooms,
    minPrice,
    maxPrice,
    priceSlider,
    selectedPriceBucket,
    activePurchasePrice,
    activeDesiredRent,
    activeMinimumYield,
  ]);

  const topMarket = filteredAndRankedMarkets[0];
  const topSubmarket = filteredSubmarkets[0];

  const searchDescription =
    activeSearchType === "purchase" && activePurchasePrice
      ? `Showing markets and submarkets with prices at or below ${formatCurrency(
          activePurchasePrice
        )}. Down payment and interest rate are used only to estimate mortgage impact.`
      : activeSearchType === "rent" && activeDesiredRent
      ? `Showing markets and submarkets with estimated gross monthly rent at or above ${formatCurrency(
          activeDesiredRent
        )}${
          activeMinimumYield
            ? ` and gross yield at or above ${activeMinimumYield.toFixed(1)}%`
            : ""
        }.`
      : "Showing all sample markets. Use filters, purchase assumptions, or rental income targets to personalize the results.";

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 text-[#062A55] lg:px-8 lg:py-14">
      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#16B7C9]/30 bg-[#16B7C9]/10 px-4 py-2 text-sm font-semibold text-[#062A55]">
            <MapPin className="h-4 w-4 text-[#16B7C9]" />
            BuyToRent AI Market Finder
          </div>

          <h1 className="text-4xl font-black tracking-tight text-[#062A55] sm:text-5xl">
            Find low-price, high-rent markets.
          </h1>

          <p className="mt-3 max-w-3xl text-slate-700">
            Compare rental markets, submarkets, and sample for-sale properties
            by purchase price, gross monthly rent, gross yield, renter demand,
            supply, market risk, and BuyToRent Score.
          </p>
        </div>

        <Button href="/mortgage-estimator">
          Use calculators <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-5">
        <Card className="p-5">
          <div className="text-sm text-slate-200">Submarkets</div>
          <div className="mt-1 text-3xl font-black text-white">
            {filteredSubmarkets.length}
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-sm text-slate-200">For-sale matches</div>
          <div className="mt-1 text-3xl font-black text-white">
            {filteredListings.length}
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-sm text-slate-200">Top submarket</div>
          <div className="mt-1 text-xl font-black text-white">
            {topSubmarket ? topSubmarket.submarket : "No match"}
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-sm text-slate-200">Top gross yield</div>
          <div className="mt-1 text-3xl font-black text-[#16B7C9]">
            {topSubmarket ? `${topSubmarket.grossYield.toFixed(1)}%` : "-"}
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-sm text-slate-200">Top score</div>
          <div className="mt-1 text-3xl font-black text-[#16B7C9]">
            {topSubmarket ? topSubmarket.buyToRentScore : "-"}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <Card className="p-6 lg:p-8">
            <div className="mb-5 flex items-center gap-3">
              <Search className="h-6 w-6 text-[#16B7C9]" />
              <h2 className="text-2xl font-black text-white">
                Market filters
              </h2>
            </div>

            <p className="mb-5 text-sm leading-6 text-slate-200">
              Refine markets, submarkets, and matching properties by type, beds,
              baths, price range, and heat map layer.
            </p>

            <div className="grid gap-4">
              <label className="block">
                <span className="mb-1 block text-xs text-slate-200">
                  Property type
                </span>
                <select
                  value={selectedPropertyType}
                  onChange={(e) => setSelectedPropertyType(e.target.value)}
                  className="min-h-11 w-full rounded-2xl bg-white px-4 text-[#062A55] outline-none"
                >
                  <option>Any</option>
                  <option>Apartment/Condo</option>
                  <option>Townhome</option>
                  <option>House</option>
                  <option>Multi unit</option>
                  <option>Apartment building</option>
                  <option>Commercial</option>
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs text-slate-200">
                    Bedrooms
                  </span>
                  <select
                    value={bedrooms ?? ""}
                    onChange={(e) =>
                      setBedrooms(e.target.value ? Number(e.target.value) : null)
                    }
                    className="min-h-11 w-full rounded-2xl bg-white px-4 text-[#062A55] outline-none"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs text-slate-200">
                    Bathrooms
                  </span>
                  <select
                    value={bathrooms ?? ""}
                    onChange={(e) =>
                      setBathrooms(
                        e.target.value ? Number(e.target.value) : null
                      )
                    }
                    className="min-h-11 w-full rounded-2xl bg-white px-4 text-[#062A55] outline-none"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-1 block text-xs text-slate-200">
                  Price bucket
                </span>
                <select
                  value={selectedPriceBucket}
                  onChange={(e) => setSelectedPriceBucket(e.target.value)}
                  className="min-h-11 w-full rounded-2xl bg-white px-4 text-[#062A55] outline-none"
                >
                  <option>Any</option>
                  <option>{"<$100K"}</option>
                  <option>$101K–$200K</option>
                  <option>$201K–$300K</option>
                  <option>$301K–$500K</option>
                  <option>{">$501K"}</option>
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs text-slate-200">
                    Min price
                  </span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                    className="min-h-11 w-full rounded-2xl bg-white px-4 text-[#062A55] outline-none"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs text-slate-200">
                    Max price
                  </span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="1000000"
                    className="min-h-11 w-full rounded-2xl bg-white px-4 text-[#062A55] outline-none"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-1 block text-xs text-slate-200">
                  Price slider: {formatCurrency(priceSlider)}
                </span>
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="25000"
                  value={priceSlider}
                  onChange={(e) => setPriceSlider(Number(e.target.value))}
                  className="w-full accent-[#16B7C9]"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs text-slate-200">
                  Heat map layer
                </span>
                <select
                  value={heatMapLayer}
                  onChange={(e) => setHeatMapLayer(e.target.value)}
                  className="min-h-11 w-full rounded-2xl bg-white px-4 text-[#062A55] outline-none"
                >
                  <option value="buyToRentScore">BuyToRent Score</option>
                  <option value="homePrice">Home Price</option>
                  <option value="locationScore">Location Score</option>
                  <option value="propertyRatingScore">
                    Property Rating Score
                  </option>
                  <option value="listingCount">Listing Count</option>
                  <option value="grossMonthlyRent">Gross Monthly Rent</option>
                  <option value="grossYield">Gross Yield</option>
                  <option value="rentalRevenuePotential">
                    Rental Revenue Potential
                  </option>
                </select>
              </label>
            </div>
          </Card>

          <Card className="p-6 lg:p-8">
            <div className="mb-5 flex items-center gap-3">
              <Home className="h-6 w-6 text-[#16B7C9]" />
              <h2 className="text-2xl font-black text-white">
                Purchase assumptions
              </h2>
            </div>

            <p className="mb-5 text-sm leading-6 text-slate-200">
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
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[#16B7C9] px-6 font-bold text-white transition hover:bg-[#119AA9]"
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
                    monthlyPayment !== null ? formatCurrency(monthlyPayment) : "-"
                  }
                />
              </div>
            )}
          </Card>

          <Card className="p-6 lg:p-8">
            <div className="mb-5 flex items-center gap-3">
              <DollarSign className="h-6 w-6 text-[#16B7C9]" />
              <h2 className="text-2xl font-black text-white">
                Rental income target
              </h2>
            </div>

            <p className="mb-5 text-sm leading-6 text-slate-200">
              Enter your desired gross monthly rental income to find markets with
              rents at or above that target. Minimum gross yield is optional and
              further refines the output.
            </p>

            <div className="grid gap-4">
              <Input
                label="Desired gross monthly rent"
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
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[#16B7C9] px-6 font-bold text-white transition hover:bg-[#119AA9]"
            >
              <Search className="mr-2 h-4 w-4" />
              Search by rental income
            </button>

            {activeSearchType === "rent" && activeDesiredRent && (
              <div className="mt-6 rounded-3xl bg-white/10 p-5">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-100">
                  <Calculator className="h-4 w-4 text-[#16B7C9]" />
                  Active rental search
                </div>

                <p className="text-sm leading-6 text-slate-200">
                  Showing markets with estimated gross monthly rent at or above{" "}
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
              <Percent className="h-6 w-6 text-[#16B7C9]" />
              <h2 className="text-2xl font-black text-white">
                Matching markets
              </h2>
            </div>

            <div className="text-5xl font-black text-white">
              {filteredAndRankedMarkets.length}
            </div>

            <p className="mt-3 text-sm leading-6 text-slate-200">
              {searchDescription}
            </p>

            {activeSearchType !== "default" && (
              <button
                onClick={resetSearch}
                className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-5 text-sm font-bold text-white transition hover:bg-white/20"
              >
                Reset search
              </button>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          {topSubmarket ? (
            <Card className="p-6 lg:p-8">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                <div>
                  <div className="mb-2 text-sm font-semibold text-[#16B7C9]">
                    Top submarket match
                  </div>

                  <h2 className="text-3xl font-black text-white">
                    {topSubmarket.submarket}
                  </h2>

                  <p className="mt-1 text-sm text-slate-300">
                    {topSubmarket.parentMarket}
                  </p>

                  <p className="mt-3 max-w-2xl leading-7 text-slate-200">
                    {topSubmarket.note}
                  </p>
                </div>

                <ScoreBadge score={topSubmarket.buyToRentScore} />
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                <Metric
                  label="Median price"
                  value={formatCurrency(topSubmarket.medianHomePrice)}
                />

                <Metric
                  label="Gross monthly rent"
                  value={formatCurrency(topSubmarket.grossMonthlyRent)}
                  highlight
                />

                <Metric
                  label="Gross yield"
                  value={`${topSubmarket.grossYield.toFixed(1)}%`}
                  highlight
                />

                <Metric label="Listings" value={`${topSubmarket.listingCount}`} />
              </div>
            </Card>
          ) : (
            <Card className="border-red-400/20 bg-red-400/10 p-6 lg:p-8">
              <h2 className="text-2xl font-black text-white">
                No submarkets match yet
              </h2>

              <p className="mt-3 text-slate-200">
                Try increasing your price range, lowering your desired rent, or
                removing a property-type filter.
              </p>
            </Card>
          )}

          <Card className="p-6 lg:p-8">
            <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-2xl font-black text-white">
                  BuyToRent Market Heat Map
                </h2>
                <p className="mt-2 text-sm text-slate-200">
                  Sample heat map preview by {getLayerLabel(heatMapLayer)}.
                </p>
              </div>

              <div className="rounded-2xl bg-white px-4 py-3 text-sm font-bold text-[#062A55]">
                {getLayerLabel(heatMapLayer)}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSubmarkets.slice(0, 9).map((submarket) => {
                const layerValue = getLayerValue(submarket, heatMapLayer);

                return (
                  <div
                    key={submarket.id}
                    className="rounded-3xl border border-white/10 bg-white/10 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-black text-white">
                          {submarket.submarket}
                        </div>
                        <div className="mt-1 text-xs text-slate-300">
                          {submarket.parentMarket}
                        </div>
                      </div>

                      <div className="rounded-full bg-[#16B7C9]/20 px-3 py-1 text-sm font-black text-[#16B7C9]">
                        {submarket.buyToRentScore}
                      </div>
                    </div>

                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[#16B7C9]"
                        style={{
                          width: `${Math.max(
                            12,
                            Math.min(100, submarket.buyToRentScore)
                          )}%`,
                        }}
                      />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-200">
                      <div>Price: {formatCurrency(submarket.medianHomePrice)}</div>
                      <div>Rent: {formatCurrency(submarket.grossMonthlyRent)}</div>
                      <div>Yield: {submarket.grossYield.toFixed(1)}%</div>
                      <div>
                        Layer: {formatLayerValue(layerValue, heatMapLayer)}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredSubmarkets.length === 0 && (
                <div className="rounded-3xl border border-white/10 bg-white/10 p-6 text-center text-slate-200 sm:col-span-2 lg:col-span-3">
                  No submarkets match your current filters.
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 lg:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Building2 className="h-6 w-6 text-[#16B7C9]" />
              <h2 className="text-2xl font-black text-white">
                Submarket rankings
              </h2>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/10 text-slate-200">
                  <tr>
                    <th className="px-4 py-3">Submarket</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Gross Rent</th>
                    <th className="px-4 py-3">Yield</th>
                    <th className="px-4 py-3">Listings</th>
                    <th className="px-4 py-3">Score</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredSubmarkets.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t border-white/10 text-slate-100"
                    >
                      <td className="px-4 py-4 font-semibold">
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#16B7C9]" />
                          {row.submarket}
                        </span>
                        <div className="mt-1 text-xs text-slate-400">
                          {row.parentMarket}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        {formatCurrency(row.medianHomePrice)}
                      </td>
                      <td className="px-4 py-4">
                        {formatCurrency(row.grossMonthlyRent)}
                      </td>
                      <td className="px-4 py-4">
                        {row.grossYield.toFixed(1)}%
                      </td>
                      <td className="px-4 py-4">{row.listingCount}</td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-[#16B7C9]/20 px-3 py-1 font-bold text-[#16B7C9]">
                          {row.buyToRentScore}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filteredSubmarkets.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-slate-300"
                      >
                        No submarkets match your current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-6 lg:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white">
                  Matching properties for sale
                </h2>
                <p className="mt-2 text-sm text-slate-200">
                  Sample for-sale properties that match your selected criteria.
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 px-4 py-3 text-xl font-black text-white">
                {filteredListings.length}
              </div>
            </div>

            <div className="grid gap-4">
              {filteredListings.map((listing) => (
                <div
                  key={listing.id}
                  className="rounded-3xl border border-white/10 bg-white/10 p-5"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <div className="mb-2 inline-flex rounded-full bg-[#16B7C9]/20 px-3 py-1 text-xs font-bold text-[#16B7C9]">
                        {listing.status}
                      </div>

                      <h3 className="text-xl font-black text-white">
                        {listing.address}
                      </h3>

                      <p className="mt-1 text-sm text-slate-300">
                        {listing.submarket} · {listing.propertyType} ·{" "}
                        {listing.beds} bd / {listing.baths} ba
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white px-4 py-3 text-center">
                      <div className="text-xs font-bold text-[#062A55]">
                        BuyToRent Score
                      </div>
                      <div className="text-3xl font-black text-[#16B7C9]">
                        {listing.buyToRentScore}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-4">
                    <Metric label="Price" value={formatCurrency(listing.price)} />

                    <Metric
                      label="Gross monthly rent"
                      value={formatCurrency(listing.estimatedGrossMonthlyRent)}
                      highlight
                    />

                    <Metric
                      label="Gross yield"
                      value={`${listing.grossYield.toFixed(1)}%`}
                      highlight
                    />

                    <Metric
                      label="Avg. tax rate"
                      value={`${listing.avgTaxRate}%`}
                    />
                  </div>

                  <a
                    href={listing.listingUrl}
                    className="mt-5 inline-flex min-h-11 items-center justify-center rounded-2xl bg-[#16B7C9] px-5 text-sm font-bold text-white transition hover:bg-[#119AA9]"
                  >
                    View listing
                  </a>
                </div>
              ))}

              {filteredListings.length === 0 && (
                <div className="rounded-3xl border border-white/10 bg-white/10 p-6 text-center text-slate-200">
                  No sample listings match your current filters.
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 lg:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Building2 className="h-6 w-6 text-[#16B7C9]" />
              <h2 className="text-2xl font-black text-white">
                Market rankings
              </h2>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/10 text-slate-200">
                  <tr>
                    <th className="px-4 py-3">Market</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Gross Rent</th>
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
                      className="border-t border-white/10 text-slate-100"
                    >
                      <td className="px-4 py-4 font-semibold">
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#16B7C9]" />
                          {row.market}
                        </span>
                      </td>

                      <td className="px-4 py-4">{formatCurrency(row.price)}</td>
                      <td className="px-4 py-4">{formatCurrency(row.rent)}</td>
                      <td className="px-4 py-4">{row.yield.toFixed(1)}%</td>
                      <td className="px-4 py-4">{row.renterDemand}</td>
                      <td className="px-4 py-4">{row.risk}</td>
                      <td className="px-4 py-4">
                        <span className="rounded-full bg-[#16B7C9]/20 px-3 py-1 font-bold text-[#16B7C9]">
                          {row.personalizedScore}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filteredAndRankedMarkets.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-8 text-center text-slate-300"
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
          <TrendingUp className="mb-4 h-7 w-7 text-[#16B7C9]" />

          <h3 className="text-xl font-black text-white">
            Personalized rankings
          </h3>

          <p className="mt-2 text-slate-200">
            Users can search by purchase price, rental income, property type,
            bedrooms, bathrooms, and price range.
          </p>
        </Card>

        <Card className="p-6">
          <ShieldCheck className="mb-4 h-7 w-7 text-[#16B7C9]" />

          <h3 className="text-xl font-black text-white">Risk layer</h3>

          <p className="mt-2 text-slate-200">
            Cheap properties can hide vacancy, repairs, taxes, insurance, or
            resale risk.
          </p>
        </Card>

        <Card className="p-6">
          <Bell className="mb-4 h-7 w-7 text-[#16B7C9]" />

          <h3 className="text-xl font-black text-white">Deal alerts</h3>

          <p className="mt-2 text-slate-200">
            Users can save a buy box and get notified when matching properties
            appear.
          </p>
        </Card>
      </div>
    </main>
  );
}
