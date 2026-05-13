import { ArrowRight, Info } from "lucide-react";
import { Button, Card } from "@/components/ui";

export function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <Card className="border-[#16B7C9]/20 p-8 lg:p-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#16B7C9]/30 bg-[#16B7C9]/10 px-4 py-2 text-sm font-semibold text-white">
              <Info className="h-4 w-4 text-[#16B7C9]" />
              Want more info?
            </div>

            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
              Get early access to BuyToRent AI.
            </h2>

            <p className="mt-3 max-w-3xl text-slate-200">
              Save your buy box, receive sample market reports, and be first in
              line when live rental data launches.
            </p>
          </div>

          <Button href="/early-access">
            Get early access <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </section>
  );
}
