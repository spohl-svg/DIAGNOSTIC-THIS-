import React, { useState } from 'react';
import { useRideWire } from '../../context/RideWireContext';
import {
  Sparkles,
  Bot,
  UserCheck,
  Wrench,
  DollarSign,
  ShieldCheck,
  Send,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  Layers,
  Zap,
} from 'lucide-react';

export const GeminiTwinCoPilot: React.FC = () => {
  const {
    activeVehicle,
    circuits,
    multimeter,
    faultCodes,
    twinReport,
    isTwinDiagnosing,
    runTwinDiagnosis,
    addWorkOrder,
    setMode,
  } = useRideWire();

  const [customSymptom, setCustomSymptom] = useState(
    'Intermittent loss of ECM communication when vehicle hits vibration bumps; battery dead after 2 days of parking.'
  );

  const presetSymptoms = [
    'Van dies randomly over bumps; cluster lights flash U0100',
    'Parasitic 480mA battery drain overnight after key-off sleep',
    'CAN-Bus High-Speed network offline; terminating resistor loop open',
    'Trailer brake controller loses ground reference under heavy braking',
  ];

  const handleConvertDiagnosisToQuote = () => {
    if (!twinReport) return;

    const rep = twinReport.serviceAdvisorReport;
    const newWo = {
      id: `wo-${Date.now()}`,
      orderNumber: `RW-2026-${Math.floor(100 + Math.random() * 900)}`,
      vehicleId: activeVehicle.id,
      customerName: activeVehicle.customerName,
      companyName: activeVehicle.companyName,
      status: 'ESTIMATE' as const,
      createdAt: new Date().toISOString(),
      dueAt: new Date(Date.now() + 86400000 * 2).toISOString(),
      items: [
        {
          id: `item-${Date.now()}-1`,
          type: 'DIAGNOSTIC' as const,
          description: `RideWire Forensic Electrical Diagnostic (${activeVehicle.year} ${activeVehicle.make})`,
          quantity: 1,
          unitPrice: 195.0,
          costPrice: 40.0,
          total: 195.0,
        },
        {
          id: `item-${Date.now()}-2`,
          type: 'LABOR' as const,
          description: rep.recommendedRepair || 'Harness Pin Replacement & Mil-Spec Solder Splice',
          quantity: rep.estimatedLaborHours || 2.5,
          unitPrice: rep.laborRate || 145.0,
          costPrice: 45.0 * (rep.estimatedLaborHours || 2.5),
          total: (rep.estimatedLaborHours || 2.5) * (rep.laborRate || 145.0),
        },
        {
          id: `item-${Date.now()}-3`,
          type: 'PART' as const,
          description: 'Automotive TXL Primary Wire, Raychem Dual-Wall Shrink & Deutsch Terminals',
          quantity: 1,
          unitPrice: rep.partsCost || 38.5,
          costPrice: 14.0,
          total: rep.partsCost || 38.5,
        },
      ],
      subtotal: 0,
      tax: 0,
      deposit: 0,
      total: 0,
      grossProfit: 0,
      profitMarginPercent: 0,
      technicianNotes: twinReport.masterTechReport.probableFault || 'Harness terminal oxidation isolated.',
      customerNotes: rep.customerExplanation || 'Electrical network communication restored.',
      approvedByCustomer: false,
    };

    // Calculate subtotal and tax
    const subtotal = newWo.items.reduce((sum, item) => sum + item.total, 0);
    const costTotal = newWo.items.reduce((sum, item) => sum + item.costPrice, 0);
    const tax = +(subtotal * 0.08).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);
    const grossProfit = +(subtotal - costTotal).toFixed(2);
    const profitMarginPercent = +((grossProfit / subtotal) * 100).toFixed(1);

    addWorkOrder({
      ...newWo,
      subtotal,
      tax,
      total,
      grossProfit,
      profitMarginPercent,
    });

    // Switch to office mode to review the quote
    setMode('OFFICE');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Twin Architecture Statement */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 shadow-lg shadow-indigo-500/25">
              <Bot className="w-7 h-7 text-white" />
              <Sparkles className="w-4 h-4 text-amber-300 absolute -top-1 -right-1" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded">
                  Gemini Dual-Twin Core
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Engineered with Gemini 3.8 Flash
                </span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight mt-1">
                The RideWire Twin Diagnostic Co-Pilot
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
                Two synchronized intelligences working in harmony: <span className="text-cyan-400 font-semibold">Twin A</span> (Master Forensic Diagnostician) breaks down the physical wiring and pinouts; <span className="text-amber-400 font-semibold">Twin B</span> (Executive Service Advisor & CEO Partner) transforms technical findings into high-margin sellable quotes that customers approve immediately.
              </p>
            </div>
          </div>

          <button
            onClick={() => runTwinDiagnosis(customSymptom)}
            disabled={isTwinDiagnosing}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white font-black rounded-xl text-xs shadow-xl shadow-indigo-500/25 transition disabled:opacity-50 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isTwinDiagnosing ? 'Synchronizing Both Twins...' : 'Run Dual Twin Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Input Card: Symptom & Real-time Live Telemetry Feed */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex justify-between items-center text-xs">
          <label className="font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Wrench className="w-4 h-4 text-cyan-400" />
            Vehicle Complaint & Field Symptoms
          </label>
          <span className="text-[11px] font-mono text-slate-400">
            Feeding Live DMM ({multimeter.voltage.toFixed(2)}V, {multimeter.resistance.toFixed(1)}Ω) + {faultCodes.filter(f => f.status === 'ACTIVE').length} Fault Codes
          </span>
        </div>

        <div className="relative">
          <textarea
            value={customSymptom}
            onChange={(e) => setCustomSymptom(e.target.value)}
            rows={2}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            placeholder="Enter symptom, DTCs, customer notes, or observed multimeter readings..."
          />
        </div>

        {/* Preset Prompt Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-slate-500 font-medium">Quick Presets:</span>
          {presetSymptoms.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setCustomSymptom(preset)}
              className="text-[11px] px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg transition text-left"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Synchronized Twin Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TWIN A: Master Electrical Diagnostician */}
        <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white tracking-wide">
                    TWIN A: Master Electrical Diagnostician
                  </h3>
                  <p className="text-[11px] text-cyan-400 font-mono">
                    Forensic Harness & CAN-Bus Root Cause
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded font-bold">
                PHYSICAL LAYER
              </span>
            </div>

            {/* Diagnostic Content */}
            <div className="mt-4 space-y-4 text-xs">
              <div>
                <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                  Probable Electrical Fault
                </h4>
                <p className="text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed font-mono">
                  {twinReport?.masterTechReport.probableFault ||
                    'High-resistance splice corrosion (S104) and fractured terminating resistor wire on CAN-H bus loop behind battery tray, causing 124Ω loop impedance.'}
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">
                  Pinout Probing Coordinates
                </h4>
                <div className="space-y-1.5">
                  {(
                    twinReport?.masterTechReport.pinoutProbingPoints || [
                      'Probe DLC Pin 6 (CAN-H) to Pin 14 (CAN-L): Must read 60Ω (reading 124.5Ω - loop open).',
                      'Backprobe Relay R3 Pin 87: Check for 12.6V under 10A dynamic load test.',
                      'Check Ground Eyelet G102 on left frame rail for < 0.08V voltage drop.',
                    ]
                  ).map((point, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/60"
                    >
                      <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-slate-300 font-mono text-[11px]">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">
                  Isolation & Test Procedures
                </h4>
                <div className="space-y-1.5">
                  {(
                    twinReport?.masterTechReport.isolationSteps || [
                      'Disconnect battery negative terminal and wait 60s.',
                      'Disconnect ECM C1 connector and inspect Pin 24 for terminal push-out or fretting corrosion.',
                      'Perform wiggle test along firewall harness branch while monitoring DMM continuity beeper.',
                    ]
                  ).map((step, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase text-red-400 tracking-wider mb-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Critical Safety Notes
                </h4>
                <div className="p-2.5 bg-red-950/30 border border-red-500/30 rounded-xl text-red-200 text-[11px] leading-relaxed">
                  {(twinReport?.masterTechReport.safetyWarnings?.[0] ||
                    'Never pierce sealed wire insulation with needle probes on CAN lines; puncturing insulation allows capillary moisture absorption leading to wire rot within 6 months. Always back-probe pins with micro-spoons.')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TWIN B: Executive Service Advisor & Shop President */}
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white tracking-wide">
                    TWIN B: Executive Service Advisor & CEO Partner
                  </h3>
                  <p className="text-[11px] text-amber-400 font-mono">
                    Customer Translation & High-Margin Quotes
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                REVENUE LAYER
              </span>
            </div>

            {/* Service Advisor Content */}
            <div className="mt-4 space-y-4 text-xs">
              <div>
                <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                  Customer-Facing Plain English Explanation
                </h4>
                <p className="text-slate-200 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed italic">
                  "{twinReport?.serviceAdvisorReport.customerExplanation ||
                    'The vehicle’s main engine computer is momentarily losing electrical contact over bumps because a key wiring joint has corroded. This shuts down the data link and causes the van to stall out. We will replace the damaged wiring with high-temp waterproof aircraft wire and reseal the connector.'}"
                </p>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                  Recommended Service & Labor Breakdown
                </h4>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Service:</span>
                    <span className="text-white font-medium text-right max-w-[240px]">
                      {twinReport?.serviceAdvisorReport.recommendedRepair ||
                        'Harness Teardown, Mil-Spec Solder Splice & Weather Seal'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Labor:</span>
                    <span className="text-amber-400 font-bold font-mono">
                      {twinReport?.serviceAdvisorReport.estimatedLaborHours || 2.5} hrs @ $
                      {twinReport?.serviceAdvisorReport.laborRate || 145}/hr
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Required Materials:</span>
                    <span className="text-cyan-300 font-mono">
                      ${twinReport?.serviceAdvisorReport.partsCost || 38.5} (TXL wire, Raychem shrink, Deutsch pins)
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold">
                    <span className="text-white">Suggested Quote Total:</span>
                    <span className="text-emerald-400 font-mono text-base">
                      ${(twinReport?.serviceAdvisorReport.suggestedQuoteTotal || 401.0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1">
                  Nationwide Warranty & Peace of Mind
                </h4>
                <div className="p-2.5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl text-emerald-300 text-[11px] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>
                    {twinReport?.serviceAdvisorReport.warrantyOffered ||
                      '12-Month / 12,000-Mile Complete Electrical Workmanship Guarantee'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action: Push Directly to Work Order */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <button
              onClick={handleConvertDiagnosisToQuote}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-500/20 transition"
            >
              <FileText className="w-4 h-4" />
              <span>Convert Diagnosis into Customer Work Order ($401.00)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
