import React, { useState } from 'react';
import { useRideWire } from '../../context/RideWireContext';
import {
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Sliders,
  Check,
  FileCheck,
} from 'lucide-react';
import { SelfHealingStep } from '../../types';

export const SelfHealingEngine: React.FC = () => {
  const {
    selfHealingSteps,
    updateSelfHealingStep,
    resetSelfHealing,
    executeSelfHealingRepair,
    activeVehicle,
    selectedCircuit,
  } = useRideWire();

  const [isRunningAutoProtocol, setIsRunningAutoProtocol] = useState(false);
  const [successBanner, setSuccessBanner] = useState(false);

  const handleRunAutoProtocol = () => {
    setIsRunningAutoProtocol(true);
    setSuccessBanner(false);

    // Simulate step-by-step sequential verification
    setTimeout(() => {
      updateSelfHealingStep(1, 'PASSED', 'Terminal 30 supply verified at 12.6V.');
    }, 600);

    setTimeout(() => {
      updateSelfHealingStep(2, 'PASSED', 'G102 lug wire-brushed, dielectric coated, and torqued to 9Nm.');
    }, 1200);

    setTimeout(() => {
      updateSelfHealingStep(3, 'PASSED', 'Termination loop resoldered with dual-wall seal. 60.0Ω restored.');
    }, 1800);

    setTimeout(() => {
      updateSelfHealingStep(4, 'PASSED', 'Dynamic 5A load applied. Continuous zero-loss tone verified.');
      executeSelfHealingRepair();
      setIsRunningAutoProtocol(false);
      setSuccessBanner(true);
    }, 2400);
  };

  const allPassed = selfHealingSteps.every((s) => s.status === 'PASSED');

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <ShieldCheck className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded">
                  Autonomous Remediation Protocol
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ISO 14229 / SAE Guided Troubleshooting
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">
                RideWire Self-Healing Circuit Diagnostics
              </h2>
              <p className="text-xs text-slate-400">
                Automated fault isolation, dynamic load emulation, relay bypass verification, and wiring integrity certification.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunAutoProtocol}
              disabled={isRunningAutoProtocol}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-emerald-500/25 transition disabled:opacity-50"
            >
              {isRunningAutoProtocol ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Running Isolation Tree...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Execute Full Self-Healing Protocol</span>
                </>
              )}
            </button>

            <button
              onClick={resetSelfHealing}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-300 font-medium transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Protocol</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Banner if All Healed */}
      {successBanner && (
        <div className="p-4 bg-emerald-950/80 border-2 border-emerald-500 rounded-xl flex items-center justify-between text-white shadow-lg animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-emerald-300">
                Self-Healing Verification Complete & Certified!
              </h4>
              <p className="text-xs text-emerald-100/80">
                High-resistance CAN-H termination restored (59.8Ω). Ground G102 drop resolved (0.02V). Active DTCs U0100 & P0685 cleared.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono bg-emerald-900 px-3 py-1 rounded text-emerald-300 border border-emerald-700 font-bold">
              CERTIFIED RIDEWIRE SPEC
            </span>
          </div>
        </div>
      )}

      {/* Step by Step Remediation Steps */}
      <div className="grid grid-cols-1 gap-4">
        {selfHealingSteps.map((step) => {
          const isPassed = step.status === 'PASSED';
          const isInProgress = step.status === 'IN_PROGRESS';
          const isFailed = step.status === 'FAILED';

          return (
            <div
              key={step.stepNumber}
              className={`p-5 rounded-2xl border transition-all ${
                isPassed
                  ? 'bg-slate-900/90 border-emerald-500/40 shadow-md shadow-emerald-500/5'
                  : isInProgress
                  ? 'bg-slate-900 border-amber-500/60 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-950/70 border-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Step Number Badge */}
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-xl font-bold font-mono text-xs shrink-0 ${
                      isPassed
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                        : isInProgress
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : `0${step.stepNumber}`}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white tracking-wide">
                        {step.title}
                      </h3>
                      <span
                        className={`text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded ${
                          isPassed
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                            : isInProgress
                            ? 'bg-amber-950 text-amber-400 border border-amber-500/30 animate-pulse'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {step.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {step.action}
                    </p>

                    <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono">
                      <div className="text-cyan-300 bg-cyan-950/40 border border-cyan-500/20 px-2 py-1 rounded">
                        <span className="text-slate-400">Target Spec:</span> {step.expectedReading}
                      </div>
                      <div className="text-amber-300/90 bg-amber-950/30 border border-amber-500/20 px-2 py-1 rounded">
                        <span className="text-slate-400">Safety Check:</span> {step.safetyCheck}
                      </div>
                    </div>

                    {step.userNotes && (
                      <div className="mt-2 text-xs text-emerald-300/90 bg-emerald-950/30 p-2 rounded border border-emerald-500/20">
                        <span className="font-bold">Technician Verification Log:</span> {step.userNotes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Step Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() =>
                      updateSelfHealingStep(
                        step.stepNumber,
                        'PASSED',
                        'Bench verified with DMM under simulated load.'
                      )
                    }
                    className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 text-xs font-bold rounded-lg border border-emerald-500/40 transition"
                  >
                    Pass Step
                  </button>
                  <button
                    onClick={() =>
                      updateSelfHealingStep(
                        step.stepNumber,
                        'IN_PROGRESS',
                        'Back-probe connected. Awaiting thermal cycle.'
                      )
                    }
                    className="px-3 py-1.5 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 text-xs font-bold rounded-lg border border-amber-500/40 transition"
                  >
                    Set Testing
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Certification Footer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileCheck className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              RideWire Self-Healing Certificate Status
            </div>
            <div className="text-[11px] text-slate-400">
              {allPassed
                ? 'All isolation nodes verified. Ready to attach to customer invoice as certified guarantee.'
                : 'Pending technician isolation steps before customer warranty release.'}
            </div>
          </div>
        </div>

        <button
          onClick={executeSelfHealingRepair}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition"
        >
          Force Electrical Re-Zero & Reseal
        </button>
      </div>
    </div>
  );
};
