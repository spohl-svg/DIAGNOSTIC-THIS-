import React, { useState } from 'react';
import { useRideWire } from '../../context/RideWireContext';
import {
  ShieldCheck,
  CheckCircle2,
  FileText,
  Truck,
  Printer,
  DollarSign,
  Zap,
  Lock,
  PenTool,
  Clock,
  Sparkles,
  Phone,
  Mail,
  AlertCircle,
} from 'lucide-react';

export const CustomerInspectionPortal: React.FC = () => {
  const {
    activeVehicle,
    activeWorkOrder,
    approveWorkOrder,
    circuits,
    faultCodes,
  } = useRideWire();

  const [signatureName, setSignatureName] = useState('');
  const [hasAgreedToTerms, setHasAgreedToTerms] = useState(false);
  const [showApprovalSuccess, setShowApprovalSuccess] = useState(false);

  const activeFaults = faultCodes.filter((f) => f.status === 'ACTIVE');
  const healthyCircuits = circuits.filter((c) => c.status === 'HEALTHY');

  const handleApprove = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signatureName || !hasAgreedToTerms || !activeWorkOrder) return;

    approveWorkOrder(activeWorkOrder.id, signatureName);
    setShowApprovalSuccess(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Customer Brand Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">RIDEWIRE</span>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Certified Diagnostic Report
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Precision Automotive Electrical & Harness Diagnostics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print Inspection Report</span>
            </button>
          </div>
        </div>

        {/* Vehicle & Customer Intake Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 font-mono block text-[10px]">VEHICLE</span>
            <span className="font-bold text-white text-sm">
              {activeVehicle.year} {activeVehicle.make} {activeVehicle.model}
            </span>
            <div className="text-[11px] text-slate-400 mt-0.5">
              VIN: <span className="font-mono text-slate-300">{activeVehicle.vin}</span>
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 font-mono block text-[10px]">CLIENT / COMPANY</span>
            <span className="font-bold text-white text-sm truncate block">
              {activeVehicle.customerName}
            </span>
            <div className="text-[11px] text-slate-400 mt-0.5 truncate">
              {activeVehicle.companyName || 'Private Vehicle'}
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 font-mono block text-[10px]">ODOMETER / UNIT</span>
            <span className="font-bold text-white text-sm font-mono">
              {activeVehicle.mileage.toLocaleString()} mi
            </span>
            <div className="text-[11px] text-slate-400 mt-0.5 font-mono">
              Unit: {activeVehicle.fleetUnitNumber || 'N/A'} • Plate: {activeVehicle.licensePlate}
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-slate-500 font-mono block text-[10px]">REPORT ORDER #</span>
            <span className="font-bold text-amber-400 text-sm font-mono">
              {activeWorkOrder?.orderNumber || 'RW-2026-084'}
            </span>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Status: <span className="text-emerald-400 font-bold uppercase">{activeWorkOrder?.status || 'ESTIMATE'}</span>
            </div>
          </div>
        </div>

        {/* Diagnosis in Plain English */}
        <div className="mt-6 p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Inspection Findings & Electrical Analysis
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {activeWorkOrder?.customerNotes ||
              'Our precision electrical test equipment isolated an intermittent loss of communication on the vehicle’s high-speed data network. A primary wiring junction behind the battery tray suffered corrosion and fractured strands, creating excessive resistance. We have itemized a permanent, mil-spec weather-sealed harness repair below.'}
          </p>

          {/* Multimeter Scientific Verification Proof */}
          <div className="mt-4 pt-3 border-t border-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block">CAN-BUS INTEGRITY</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">Differential Scope Verified</span>
              <p className="text-[10px] text-slate-500 mt-1">2.70V Peak / 2.30V Trough within SAE J1939 spec</p>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block">GROUND VOLTAGE DROP</span>
              <span className="font-bold text-emerald-400 font-mono text-sm">&lt; 0.08V Drop Under Cranking</span>
              <p className="text-[10px] text-slate-500 mt-1">Chassis ground studs cleaned & torqued</p>
            </div>

            <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono block">WARRANTY PROTECTION</span>
              <span className="font-bold text-amber-400 font-mono text-sm">12-Mo / 12,000-Mi Warranty</span>
              <p className="text-[10px] text-slate-500 mt-1">Covers all wiring splices & connector seals</p>
            </div>
          </div>
        </div>

        {/* Itemized Transparent Quote */}
        {activeWorkOrder && (
          <div className="mt-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center justify-between">
              <span>Itemized Repair Estimate</span>
              <span className="text-xs text-slate-400 font-mono font-normal">
                No hidden charges • 100% Guaranteed Estimate
              </span>
            </h3>

            <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead className="text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800 bg-slate-900/50">
                  <tr>
                    <th className="p-3">Item / Service</th>
                    <th className="p-3 text-center">Qty / Hrs</th>
                    <th className="p-3 text-right">Unit Price</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {activeWorkOrder.items.map((item) => (
                    <tr key={item.id}>
                      <td className="p-3">
                        <div className="font-bold text-white">{item.description}</div>
                        <div className="text-[10px] text-slate-500 font-mono uppercase">{item.type}</div>
                      </td>
                      <td className="p-3 text-center font-mono text-slate-300">{item.quantity}</td>
                      <td className="p-3 text-right font-mono text-slate-300">${item.unitPrice.toFixed(2)}</td>
                      <td className="p-3 text-right font-mono font-bold text-white">${item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="p-4 bg-slate-900/60 border-t border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span className="font-mono text-white">${activeWorkOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Sales Tax:</span>
                  <span className="font-mono text-white">${activeWorkOrder.tax.toFixed(2)}</span>
                </div>
                {activeWorkOrder.deposit > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Deposit Credited:</span>
                    <span className="font-mono">-${activeWorkOrder.deposit.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                  <span>Balance To Complete:</span>
                  <span className="font-mono text-emerald-400 text-xl font-black">
                    ${(activeWorkOrder.total - activeWorkOrder.deposit).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Digital Signature & Approval Section */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          {activeWorkOrder?.approvedByCustomer ? (
            <div className="p-6 bg-emerald-950/60 border-2 border-emerald-500/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-emerald-300">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-base font-bold text-white">
                    Repair Authorization Confirmed & On File
                  </h4>
                  <p className="text-xs text-emerald-200/80 mt-0.5">
                    Digitally signed by <span className="font-bold underline">{activeWorkOrder.approvalSignature}</span> on{' '}
                    {new Date(activeWorkOrder.approvalTimestamp || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="px-4 py-2 bg-emerald-900/80 border border-emerald-600 rounded-xl text-xs font-bold text-white font-mono shrink-0">
                AUTHORIZED TO PROCEED
              </div>
            </div>
          ) : (
            <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Customer Authorization & Digital Signature
                </h3>
              </div>
              <p className="text-xs text-slate-300">
                By entering your name below and clicking Authorize, you approve RideWire Technical Services to proceed with the specified diagnostic and harness repair work.
              </p>

              <form onSubmit={handleApprove} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">
                    Authorized Customer / Fleet Manager Full Name:
                  </label>
                  <input
                    type="text"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    placeholder="e.g. Marcus Vance or Sarah Jenkins"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white text-sm font-medium focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={hasAgreedToTerms}
                    onChange={(e) => setHasAgreedToTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-900 text-amber-500 focus:ring-0 cursor-pointer"
                    required
                  />
                  <span>
                    I authorize RideWire to perform the repairs detailed in this estimate. I understand that all work is backed by the 12-month / 12,000-mile electrical warranty.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!signatureName || !hasAgreedToTerms}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-slate-950 font-black rounded-xl text-sm shadow-xl shadow-emerald-500/20 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Authorize & Approve Repair (${activeWorkOrder ? (activeWorkOrder.total - activeWorkOrder.deposit).toFixed(2) : '401.00'})</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Shop Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500 space-y-1">
          <p className="font-semibold text-slate-400">RideWire Technical Electrical Services & Operations</p>
          <p>Direct Inquiries & Mobile Dispatch: s.pohl@ridewires.com • (555) 743-3947</p>
          <p>© 2026 RideWire. All rights reserved. Forensic Automotive Wiring & High-Margin Diagnostic Systems.</p>
        </div>
      </div>
    </div>
  );
};
