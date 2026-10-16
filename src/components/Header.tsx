import React, { useState } from 'react';
import { useRideWire } from '../context/RideWireContext';
import {
  Building2,
  Wrench,
  Smartphone,
  Truck,
  Plus,
  ShieldCheck,
  AlertTriangle,
  DollarSign,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Vehicle } from '../types';

export const Header: React.FC = () => {
  const {
    mode,
    setMode,
    vehicles,
    activeVehicle,
    setActiveVehicleId,
    addVehicle,
    faultCodes,
    workOrders,
  } = useRideWire();

  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({
    year: 2023,
    make: '',
    model: '',
    vin: '',
    licensePlate: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    mileage: 45000,
  });

  const activeFaultsCount = faultCodes.filter((f) => f.status === 'ACTIVE').length;
  const totalBilled = workOrders.reduce((acc, wo) => acc + wo.total, 0);

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVehicle.make || !newVehicle.model || !newVehicle.customerName) return;

    const created: Vehicle = {
      id: `veh-${Date.now()}`,
      year: Number(newVehicle.year) || 2023,
      make: newVehicle.make || 'Custom',
      model: newVehicle.model || 'Commercial',
      vin: newVehicle.vin || `VIN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      licensePlate: newVehicle.licensePlate || 'FLEET-01',
      customerName: newVehicle.customerName || 'Fleet Client',
      customerPhone: newVehicle.customerPhone || '(555) 000-0000',
      customerEmail: newVehicle.customerEmail || 'client@fleet.com',
      companyName: newVehicle.companyName || 'Independent Fleet',
      mileage: Number(newVehicle.mileage) || 50000,
    };

    addVehicle(created);
    setShowVehicleModal(false);
    setNewVehicle({
      year: 2023,
      make: '',
      model: '',
      vin: '',
      licensePlate: '',
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      mileage: 45000,
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg shadow-amber-500/25 ring-1 ring-amber-400/40">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-slate-950"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-amber-400 via-amber-200 to-white bg-clip-text text-transparent">
                  RIDEWIRE
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
                  OS v4.2
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
                CEO Executive Office & Pro Electrical Diagnostics
              </p>
            </div>
          </div>

          {/* Core Mode Switcher */}
          <nav className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800/80 shadow-inner">
            <button
              onClick={() => setMode('OFFICE')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'OFFICE'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Office & Business</span>
            </button>

            <button
              onClick={() => setMode('DIAGNOSTIC')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'DIAGNOSTIC'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Pro Diagnostic Tool</span>
              {activeFaultsCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    mode === 'DIAGNOSTIC' ? 'bg-red-950 text-red-200' : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {activeFaultsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMode('CUSTOMER_PORTAL')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'CUSTOMER_PORTAL'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Customer Portal</span>
            </button>
          </nav>

          {/* Vehicle Selector & Quick Metrics */}
          <div className="flex items-center gap-3">
            {/* Active Vehicle Dropdown */}
            <div className="relative hidden md:flex items-center">
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <select
                  value={activeVehicle.id}
                  onChange={(e) => setActiveVehicleId(e.target.value)}
                  className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer pr-4"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id} className="bg-slate-900 text-slate-200">
                      {v.year} {v.make} {v.model} {v.fleetUnitNumber ? `(${v.fleetUnitNumber})` : ''}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowVehicleModal(true)}
                  title="Add New Vehicle"
                  className="p-1 hover:bg-slate-800 rounded text-amber-400 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Shop Cash Flow Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 font-medium">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>${totalBilled.toLocaleString(undefined, { minimumFractionDigits: 0 })} Billed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Vehicle Modal */}
      {showVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-lg w-full shadow-2xl text-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                Intake New Vehicle to Fleet
              </h3>
              <button
                onClick={() => setShowVehicleModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Year</label>
                  <input
                    type="number"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle({ ...newVehicle, year: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Make</label>
                  <input
                    type="text"
                    placeholder="e.g. Ford, Ram"
                    value={newVehicle.make}
                    onChange={(e) => setNewVehicle({ ...newVehicle, make: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Model</label>
                  <input
                    type="text"
                    placeholder="e.g. Transit, 2500"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">VIN (17 chars)</label>
                  <input
                    type="text"
                    placeholder="1FTBR..."
                    value={newVehicle.vin}
                    onChange={(e) => setNewVehicle({ ...newVehicle, vin: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">License / Unit #</label>
                  <input
                    type="text"
                    placeholder="UNIT-502 or 7XYZ89"
                    value={newVehicle.licensePlate}
                    onChange={(e) => setNewVehicle({ ...newVehicle, licensePlate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Customer / Fleet Mgr</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newVehicle.customerName}
                    onChange={(e) => setNewVehicle({ ...newVehicle, customerName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Company / Fleet Name</label>
                  <input
                    type="text"
                    placeholder="Optional Company"
                    value={newVehicle.companyName || ''}
                    onChange={(e) => setNewVehicle({ ...newVehicle, companyName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Customer Phone</label>
                  <input
                    type="text"
                    placeholder="(555) 000-0000"
                    value={newVehicle.customerPhone}
                    onChange={(e) => setNewVehicle({ ...newVehicle, customerPhone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Mileage</label>
                  <input
                    type="number"
                    value={newVehicle.mileage}
                    onChange={(e) => setNewVehicle({ ...newVehicle, mileage: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowVehicleModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded shadow-lg shadow-amber-500/20"
                >
                  Add Vehicle to Intake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
