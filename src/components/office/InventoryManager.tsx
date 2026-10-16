import React, { useState } from 'react';
import { useRideWire } from '../../context/RideWireContext';
import {
  Package,
  Plus,
  Minus,
  AlertTriangle,
  Layers,
  Search,
  ShoppingCart,
  DollarSign,
  Tag,
} from 'lucide-react';
import { InventoryItem } from '../../types';

export const InventoryManager: React.FC = () => {
  const { inventory, updateInventoryStock } = useRideWire();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = inventory.filter((item) => {
    const matchesCategory = filterCategory === 'ALL' || item.category === filterCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.binLocation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const lowStockItems = inventory.filter((item) => item.stockQuantity <= item.reorderThreshold);
  const totalInventoryValue = inventory.reduce(
    (sum, item) => sum + item.stockQuantity * item.costPrice,
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded">
              Parts & Spool Supply
            </span>
            <span className="text-xs text-slate-400">Shop Physical Inventory Matrix</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Wire Harness Hardware & Inventory
          </h2>
          <p className="text-xs text-slate-400">
            TXL Primary wire spools, Deutsch DT connectors, Raychem heat shrink, and terminal pins.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 text-xs font-mono">
            <span className="text-slate-400 block text-[10px]">Total Valuation (Cost):</span>
            <span className="text-emerald-400 font-bold text-sm">
              ${totalInventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Low Stock Warning Card */}
      {lowStockItems.length > 0 && (
        <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="font-bold text-white">
                {lowStockItems.length} Items Below Reorder Threshold:
              </span>
              <span className="text-amber-300 ml-1">
                {lowStockItems.map((i) => i.name).join(', ')}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono uppercase bg-amber-950 text-amber-300 px-2.5 py-1 rounded border border-amber-700 font-bold">
            Reorder Advised
          </span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs">
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {['ALL', 'WIRE_SPOOL', 'CONNECTOR', 'TERMINAL_PIN', 'HEAT_SHRINK', 'RELAY_FUSE'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  filterCategory === cat
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            )
          )}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search SKU, name, or bin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Inventory Items Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">SKU & Category</th>
                <th className="p-3">Item Description</th>
                <th className="p-3">Bin Location</th>
                <th className="p-3 text-center">Stock Level</th>
                <th className="p-3 text-right">Cost Price</th>
                <th className="p-3 text-right">Retail Sell Rate</th>
                <th className="p-3 text-right">Markup %</th>
                <th className="p-3 text-center">Quick Stock Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredItems.map((item) => {
                const markupPercent = item.costPrice > 0 ? Math.round(((item.sellPrice - item.costPrice) / item.costPrice) * 100) : 0;
                const isLow = item.stockQuantity <= item.reorderThreshold;

                return (
                  <tr key={item.id} className="hover:bg-slate-800/30">
                    <td className="p-3">
                      <div className="font-mono font-bold text-white text-xs">{item.sku}</div>
                      <span className="text-[9px] uppercase font-bold text-slate-500 font-mono">
                        {item.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3 text-slate-200 font-medium max-w-xs">{item.name}</td>
                    <td className="p-3 font-mono text-cyan-400">{item.binLocation}</td>
                    <td className="p-3 text-center font-mono">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-bold ${
                          isLow ? 'bg-red-950 text-red-400 border border-red-500/30' : 'text-slate-200'
                        }`}
                      >
                        {item.stockQuantity} {item.unit}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono text-slate-400">${item.costPrice.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono font-bold text-white">${item.sellPrice.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono text-emerald-400 font-bold">+{markupPercent}%</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => updateInventoryStock(item.id, -1)}
                          className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                          title="Decrease Stock"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => updateInventoryStock(item.id, 5)}
                          className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                          title="Restock +5"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
