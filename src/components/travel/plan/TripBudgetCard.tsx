"use client";

import { ChevronDown, WalletCards,} from "lucide-react";
import { useState } from "react";
import type { TripExpense } from "@/features/travel/types";

interface TripBudgetCardProps {
  expenses: TripExpense[];
  maximumBudget: number;
}

const categoryLabels: Record< TripExpense["category"], string> = {
  travel: "Travel",
  food: "Food & drinks",
  localTransport: "Local transport",
  entry: "Entry & activities",
  other: "Other expenses",
};

export default function TripBudgetCard({ expenses, maximumBudget,}: TripBudgetCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="mt-8">
      <div className="overflow-hidden rounded-[30px] bg-[#123c35] text-white shadow-[0_22px_60px_rgba(18,60,53,0.16)]">
        <button type="button" onClick={() => setOpen((value) => !value)} className="w-full p-6 text-left sm:p-8" aria-expanded={open}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#cbe95b]">
                <WalletCards className="h-4 w-4" />

                <span className="text-[10px] font-black uppercase tracking-[0.18em]">
                  Estimated maximum trip cost
                </span>
              </div>

              <p className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                ₹
                {maximumBudget.toLocaleString("en-IN")}
              </p>

              <p className="mt-2 max-w-md text-xs leading-5 text-white/50">
                A practical upper estimate for the
                expenses we currently know about.
              </p>
            </div>

            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            </span>
          </div>
        </button>

        {open && (
          <div className="border-t border-white/10 px-6 pb-6 sm:px-8 sm:pb-8">
            <div className="divide-y divide-white/10">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between gap-5 py-4"
                >
                  <div>
                    <p className="text-sm font-bold text-white">
                      {categoryLabels[expense.category]}
                    </p>

                    <p className="mt-1 text-[11px] text-white/40">
                      {expense.description}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-black text-[#cbe95b]">
                    ₹
                    {expense.amount.toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-[18px] bg-white/5 px-4 py-3">
              <span className="text-xs font-bold text-white/60">
                Estimated total
              </span>

              <span className="text-lg font-black text-white">
                ₹
                {maximumBudget.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}