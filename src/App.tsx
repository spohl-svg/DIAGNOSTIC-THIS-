import React, { useState } from 'react';
import { RideWireProvider, useRideWire } from './context/RideWireContext';
import { Header } from './components/Header';
import { DiagnosticScanner } from './components/diagnostic/DiagnosticScanner';
import { HarnessPinoutExplorer } from './components/diagnostic/HarnessPinoutExplorer';
import { SelfHealingEngine } from './components/diagnostic/SelfHealingEngine';
import { GeminiTwinCoPilot } from './components/diagnostic/GeminiTwinCoPilot';
import { ArAiOverlayView } from './components/diagnostic/ArAiOverlayView';
import { SoundTechLab } from './components/diagnostic/SoundTechLab';
import { DiagnosticCodeDossier } from './components/diagnostic/DiagnosticCodeDossier';
import { WorkOrdersManager } from './components/office/WorkOrdersManager';
import { CoCoMarketingEngine } from './components/office/CoCoMarketingEngine';
import { InventoryManager } from './components/office/InventoryManager';
import { CashFlowCommand } from './components/office/CashFlowCommand';
import { CustomerInspectionPortal } from './components/customer/CustomerInspectionPortal';
import {
  Activity,
  Layers,
  ShieldCheck,
  Bot,
  FileText,
  Megaphone,
  Package,
  Briefcase,
  Wrench,
  Target,
  Radio,
  FileCode,
  Printer,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { mode, activeVehicle } = useRideWire();

  // Sub-tab states for Office and Diagnostic modes
  const [officeTab, setOfficeTab] = useState<'ORDERS' | 'MARKETING' | 'INVENTORY' | 'CASH_FLOW'>('ORDERS');
  const [diagnosticTab, setDiagnosticTab] = useState<'AR_OVERLAY' | 'SCANNER' | 'PINOUT' | 'SOUND_TECH' | 'SELF_HEAL' | 'TWIN' | 'CODE_DOSSIER'>('AR_OVERLAY');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mode: OFFICE & SHOP MANAGEMENT */}
        {mode === 'OFFICE' && (
          <div className="space-y-6">
            {/* Office Sub-Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl shadow-lg">
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'ORDERS', label: 'Work Orders & Invoicing', icon: FileText },
                  { id: 'MARKETING', label: 'CoCo Marketing Hub', icon: Megaphone },
                  { id: 'INVENTORY', label: 'Wire & Parts Supply', icon: Package },
                  { id: 'CASH_FLOW', label: 'CEO Cash Flow Command', icon: Briefcase },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = officeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setOfficeTab(tab.id as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono px-2">
                <span>PORTAL: BACKOFFICE & DISPATCH</span>
              </div>
            </div>

            {/* Office Tab Panels */}
            {officeTab === 'ORDERS' && <WorkOrdersManager />}
            {officeTab === 'MARKETING' && <CoCoMarketingEngine />}
            {officeTab === 'INVENTORY' && <InventoryManager />}
            {officeTab === 'CASH_FLOW' && <CashFlowCommand />}
          </div>
        )}

        {/* Mode: PRO DIAGNOSTIC TOOL */}
        {mode === 'DIAGNOSTIC' && (
          <div className="space-y-6">
            {/* Diagnostic Sub-Navigation Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-2 rounded-2xl shadow-lg">
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'AR_OVERLAY', label: 'Real Camera Optical HUD', icon: Target },
                  { id: 'SOUND_TECH', label: 'Sound Tech Audio Lab', icon: Radio },
                  { id: 'SCANNER', label: 'DMM & Wave Analyzer', icon: Activity },
                  { id: 'PINOUT', label: 'Harness & Pinout Matrix', icon: Layers },
                  { id: 'SELF_HEAL', label: 'Self-Healing Engine', icon: ShieldCheck },
                  { id: 'TWIN', label: 'Gemini Twin Co-Pilot', icon: Bot },
                  { id: 'CODE_DOSSIER', label: 'Pure Diagnostic Code PDF', icon: FileCode },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = diagnosticTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setDiagnosticTab(tab.id as any)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden lg:flex items-center gap-2 text-xs text-cyan-400 font-mono px-2 font-bold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>AR & SOUND TECH ONLINE</span>
              </div>
            </div>

            {/* Diagnostic Tab Panels */}
            {diagnosticTab === 'AR_OVERLAY' && <ArAiOverlayView />}
            {diagnosticTab === 'SOUND_TECH' && <SoundTechLab />}
            {diagnosticTab === 'SCANNER' && <DiagnosticScanner />}
            {diagnosticTab === 'PINOUT' && <HarnessPinoutExplorer />}
            {diagnosticTab === 'SELF_HEAL' && <SelfHealingEngine />}
            {diagnosticTab === 'TWIN' && <GeminiTwinCoPilot />}
            {diagnosticTab === 'CODE_DOSSIER' && <DiagnosticCodeDossier />}
          </div>
        )}

        {/* Mode: CUSTOMER INSPECTION PORTAL */}
        {mode === 'CUSTOMER_PORTAL' && <CustomerInspectionPortal />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <RideWireProvider>
      <MainContent />
    </RideWireProvider>
  );
}
