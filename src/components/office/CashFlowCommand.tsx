import React from 'react';
import { useRideWire } from '../../context/RideWireContext';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  ShieldCheck,
  Award,
  Zap,
  Target,
  ArrowUpRight,
  PieChart,
  Calendar,
} from 'lucide-react';

export const CashFlowCommand: React.FC = () => {
  const { workOrders, vehicles } = useRideWire();

  const totalBilled = workOrders.reduce((acc, wo) => acc + wo.total, 0);
  const totalGrossProfit = workOrders.reduce((acc, wo) => acc + wo.grossProfit, 0);
  const totalDeposits = workOrders.reduce((acc, wo) => acc + wo.deposit, 0);
  const averageTicket = workOrders.length > 0 ? totalBilled / workOrders.length : 0;
  const overallMargin = totalBilled > 0 ? (totalGrossProfit / totalBilled) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* CEO Executive Briefing Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                  Executive Briefing
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  S. Pohl • President & CEO, RideWire Operations
                </span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight mt-1">
                Cash Flow, Margins & Shop Command
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
                Every business starts with sweat, grit, and tight resources. Automotive wiring is the highest-margin specialty in the aftermarket because general shops lack the patience and tooling to isolate CAN-bus and harness faults. We price for expertise, collect upfront deposits, and turn every diagnostic into a profitable repair.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-2 rounded-xl text-xs font-mono">
            <span className="text-emerald-400 font-bold">STATUS: PROFIT-FOCUSED</span>
          </div>
        </div>
      </div>

      {/* Primary Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Billed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-start text-xs text-slate-400 font-mono">
            <span>TOTAL BILLED REVENUE</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white mt-2">
            ${totalBilled.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Across {workOrders.length} active service tickets</span>
          </div>
        </div>

        {/* Card 2: Gross Profit */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-start text-xs text-slate-400 font-mono">
            <span>REALIZED GROSS PROFIT</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black font-mono text-amber-400 mt-2">
            ${totalGrossProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-2 text-[11px] text-amber-300/80 font-mono">
            Avg Gross Margin: <span className="font-bold text-white">{overallMargin.toFixed(1)}%</span>
          </div>
        </div>

        {/* Card 3: Average Repair Order (ARO) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-start text-xs text-slate-400 font-mono">
            <span>AVERAGE TICKET (ARO)</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black font-mono text-cyan-300 mt-2">
            ${averageTicket.toFixed(2)}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            Target benchmark: $450 - $750/ticket
          </div>
        </div>

        {/* Card 4: Cash Deposits In Hand */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex justify-between items-start text-xs text-slate-400 font-mono">
            <span>DEPOSITS RECEIVED</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black font-mono text-purple-300 mt-2">
            ${totalDeposits.toFixed(2)}
          </div>
          <div className="mt-2 text-[11px] text-purple-300 font-semibold">
            Upfront liquidity secured before teardown
          </div>
        </div>
      </div>

      {/* CEO Strategic Rules & Shop Operations Playbook */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              The 4 Laws of RideWire Profitability
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="font-bold text-amber-400 font-mono block mb-1">
                1. Never Diagnose for Free
              </span>
              <p className="text-slate-300 leading-relaxed">
                General shops guess and change parts on the customer’s dime. RideWire charges a firm Level 2/3 diagnostic fee ($195–$260). When customers hesitate, remind them that guessing costs $1,200 in useless sensors.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="font-bold text-cyan-400 font-mono block mb-1">
                2. 80%+ Margin on Harness Restorations
              </span>
              <p className="text-slate-300 leading-relaxed">
                Wire and solder sleeves cost pennies ($10–$25 per job). The value is in knowing WHICH wire to solder and how to seal it to mil-spec standards. Price labor for specialized mastery ($145–$165/hr).
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="font-bold text-emerald-400 font-mono block mb-1">
                3. Lock in Fleet Preventative Retainers
              </span>
              <p className="text-slate-300 leading-relaxed">
                Use the CoCo Marketing Engine to pitch 5 delivery fleets. 5 fleets paying $800/month for monthly wiring audits = $4,000/mo guaranteed base cash flow before fixing a single broken wire.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="font-bold text-purple-400 font-mono block mb-1">
                4. Instant Customer Signatures via Mobile Portal
              </span>
              <p className="text-slate-300 leading-relaxed">
                Never wait for phone tag. Send the Customer Portal inspection link right to their phone while they are in line. Transparent test photos and plain-English translations get approved on the spot.
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Cash Flow & Bay Utilization Goal */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <PieChart className="w-5 h-5 text-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                Weekly Revenue Target & Breakeven Model
              </h3>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Weekly Target (5 Days):</span>
                  <span className="font-mono font-bold text-white text-sm">$3,500.00</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (totalBilled / 3500) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Current: ${totalBilled.toFixed(0)}</span>
                  <span>Goal: $3,500 (8 tickets @ $437 avg)</span>
                </div>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-slate-300 font-bold mb-1">Fixed Overhead & Break-Even</h4>
                <div className="flex justify-between text-slate-400">
                  <span>Shop Space / Mobile Van Fuel:</span>
                  <span className="font-mono text-white">$650/wk</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tool Loan / Software / Insurance:</span>
                  <span className="font-mono text-white">$250/wk</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold pt-2 border-t border-slate-800">
                  <span>Net Profit Breakeven Ticket Count:</span>
                  <span className="font-mono">2.2 Tickets / Week</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Everything billed after ticket #3 goes straight into owner equity and growth reserves.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center text-xs text-amber-300 font-medium">
            "You have the technical skills. RideWire gives you the software engine to turn that skill into wealth."
          </div>
        </div>
      </div>
    </div>
  );
};
