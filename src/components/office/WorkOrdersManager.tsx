import React, { useState } from 'react';
import { useRideWire } from '../../context/RideWireContext';
import {
  FileText,
  Plus,
  Trash2,
  DollarSign,
  Printer,
  Share2,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { WorkOrder, WorkOrderItem } from '../../types';

export const WorkOrdersManager: React.FC = () => {
  const {
    workOrders,
    activeWorkOrder,
    setActiveWorkOrderId,
    addWorkOrder,
    updateWorkOrder,
    activeVehicle,
    setMode,
  } = useRideWire();

  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemType, setNewItemType] = useState<WorkOrderItem['type']>('LABOR');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemPrice, setNewItemPrice] = useState(145);
  const [newItemCost, setNewItemCost] = useState(40);

  const handleAddItemToActive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkOrder || !newItemDesc) return;

    const item: WorkOrderItem = {
      id: `item-${Date.now()}`,
      type: newItemType,
      description: newItemDesc,
      quantity: Number(newItemQty) || 1,
      unitPrice: Number(newItemPrice) || 0,
      costPrice: Number(newItemCost) || 0,
      total: +(Number(newItemQty) * Number(newItemPrice)).toFixed(2),
    };

    const updatedItems = [...activeWorkOrder.items, item];
    updateWorkOrder(activeWorkOrder.id, { items: updatedItems });

    setNewItemDesc('');
    setNewItemQty(1);
    setNewItemPrice(145);
    setNewItemCost(40);
  };

  const handleRemoveItem = (itemId: string) => {
    if (!activeWorkOrder) return;
    const updatedItems = activeWorkOrder.items.filter((i) => i.id !== itemId);
    updateWorkOrder(activeWorkOrder.id, { items: updatedItems });
  };

  const handleCreateNewWorkOrder = () => {
    const newWo: WorkOrder = {
      id: `wo-${Date.now()}`,
      orderNumber: `RW-2026-${Math.floor(100 + Math.random() * 900)}`,
      vehicleId: activeVehicle.id,
      customerName: activeVehicle.customerName,
      companyName: activeVehicle.companyName,
      status: 'ESTIMATE',
      createdAt: new Date().toISOString(),
      dueAt: new Date(Date.now() + 86400000 * 2).toISOString(),
      items: [
        {
          id: `item-${Date.now()}-1`,
          type: 'DIAGNOSTIC',
          description: 'Level 2 Mobile Electrical Diagnostic & Pinout Test',
          quantity: 1,
          unitPrice: 195.0,
          costPrice: 40.0,
          total: 195.0,
        },
      ],
      subtotal: 195.0,
      tax: 15.6,
      deposit: 0,
      total: 210.6,
      grossProfit: 155.0,
      profitMarginPercent: 79.5,
      technicianNotes: 'Vehicle brought in for intermittent electrical diagnosis.',
      customerNotes: 'Customer requested estimate prior to teardown.',
      approvedByCustomer: false,
    };

    addWorkOrder(newWo);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">
              Revenue & Invoicing
            </span>
            <span className="text-xs text-slate-400">RideWire Shop Billing Engine</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Work Orders & Repair Estimates
          </h2>
          <p className="text-xs text-slate-400">
            Itemized parts, diagnostic rates, high-margin labor pricing, and instant customer approval links.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateNewWorkOrder}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New Work Order</span>
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Work Order Selection List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex justify-between items-center px-1">
            <span>Active Orders ({workOrders.length})</span>
            <span className="text-amber-400 font-mono">BILLING QUEUE</span>
          </div>

          <div className="space-y-2">
            {workOrders.map((wo) => {
              const isSelected = activeWorkOrder?.id === wo.id;
              return (
                <div
                  key={wo.id}
                  onClick={() => setActiveWorkOrderId(wo.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    isSelected
                      ? 'bg-slate-800 border-amber-500 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white text-xs">{wo.orderNumber}</span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded font-mono ${
                        wo.status === 'PAID'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : wo.status === 'APPROVED' || wo.status === 'IN_PROGRESS'
                          ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/30'
                          : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {wo.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-200 mt-2 truncate">{wo.customerName}</h3>
                  <p className="text-xs text-slate-400 truncate">{wo.companyName || 'Private Vehicle'}</p>

                  <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-400">Total:</span>
                    <span className="text-emerald-400 font-bold">${wo.total.toFixed(2)}</span>
                  </div>

                  {wo.approvedByCustomer && (
                    <div className="mt-2 text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Approved by Customer
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Work Order Editor / Invoice Detail (8 cols) */}
        {activeWorkOrder ? (
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            {/* Invoice Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black font-mono text-white">
                    {activeWorkOrder.orderNumber}
                  </span>
                  <select
                    value={activeWorkOrder.status}
                    onChange={(e) => updateWorkOrder(activeWorkOrder.id, { status: e.target.value as any })}
                    className="bg-slate-950 border border-slate-700 text-xs font-bold uppercase rounded px-2.5 py-1 text-amber-400 focus:outline-none"
                  >
                    <option value="ESTIMATE">ESTIMATE</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="PAID">PAID</option>
                  </select>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Customer: <span className="text-white font-bold">{activeWorkOrder.customerName}</span>{' '}
                  {activeWorkOrder.companyName && `(${activeWorkOrder.companyName})`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <button
                  onClick={() => setMode('CUSTOMER_PORTAL')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-lg transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Customer Portal</span>
                </button>
              </div>
            </div>

            {/* Itemized Line Items Table */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Billable Services & Materials
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">
                  {activeWorkOrder.items.length} ITEMS
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">Type</th>
                      <th className="p-3">Description</th>
                      <th className="p-3 text-center">Qty / Hrs</th>
                      <th className="p-3 text-right">Unit Rate</th>
                      <th className="p-3 text-right">Total</th>
                      <th className="p-3 text-center w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {activeWorkOrder.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/30">
                        <td className="p-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase ${
                              item.type === 'DIAGNOSTIC'
                                ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/30'
                                : item.type === 'LABOR'
                                ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                                : 'bg-purple-950 text-purple-400 border border-purple-500/30'
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>
                        <td className="p-3 text-white font-medium">{item.description}</td>
                        <td className="p-3 text-center font-mono text-slate-300">{item.quantity}</td>
                        <td className="p-3 text-right font-mono text-slate-300">${item.unitPrice.toFixed(2)}</td>
                        <td className="p-3 text-right font-mono font-bold text-white">${item.total.toFixed(2)}</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-slate-500 hover:text-red-400 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add New Line Item Form */}
              <form onSubmit={handleAddItemToActive} className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap gap-2 items-center text-xs">
                <select
                  value={newItemType}
                  onChange={(e) => setNewItemType(e.target.value as any)}
                  className="bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white focus:outline-none"
                >
                  <option value="DIAGNOSTIC">DIAGNOSTIC</option>
                  <option value="LABOR">LABOR</option>
                  <option value="PART">PART</option>
                  <option value="MISC">MISC</option>
                </select>

                <input
                  type="text"
                  placeholder="Service or part description..."
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  className="flex-1 min-w-[200px] bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-500"
                  required
                />

                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="Qty/Hrs"
                  value={newItemQty}
                  onChange={(e) => setNewItemQty(Number(e.target.value))}
                  className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white font-mono text-center"
                />

                <input
                  type="number"
                  step="1"
                  placeholder="Sell Rate"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(Number(e.target.value))}
                  className="w-20 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 text-white font-mono text-right"
                />

                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded shadow transition"
                >
                  Add Line
                </button>
              </form>
            </div>

            {/* Notes Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">Technician Diagnostic Notes</label>
                <textarea
                  value={activeWorkOrder.technicianNotes}
                  onChange={(e) => updateWorkOrder(activeWorkOrder.id, { technicianNotes: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300 text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Customer Facing Explanation</label>
                <textarea
                  value={activeWorkOrder.customerNotes}
                  onChange={(e) => updateWorkOrder(activeWorkOrder.id, { customerNotes: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-300 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Financial Summary & Margins (CEO Metric View) */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Labor & Parts Subtotal:</span>
                <span className="font-mono text-white">${activeWorkOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Sales Tax (8.0%):</span>
                <span className="font-mono text-white">${activeWorkOrder.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Customer Deposit Received:</span>
                <div className="flex items-center gap-1 font-mono">
                  <span>$</span>
                  <input
                    type="number"
                    value={activeWorkOrder.deposit}
                    onChange={(e) => updateWorkOrder(activeWorkOrder.id, { deposit: Number(e.target.value) })}
                    className="w-20 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-right text-emerald-400"
                  />
                </div>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
                <span>Total Balance Due:</span>
                <span className="font-mono text-emerald-400 text-lg">
                  ${(activeWorkOrder.total - activeWorkOrder.deposit).toFixed(2)}
                </span>
              </div>

              {/* CEO Profit Margin Indicator */}
              <div className="pt-3 mt-2 border-t border-slate-900 flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                  Estimated Gross Profit / Margin:
                </span>
                <span className="font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded">
                  ${activeWorkOrder.grossProfit.toFixed(2)} ({activeWorkOrder.profitMarginPercent}% Gross Margin)
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400">
            No work order selected. Create a new work order or select one from the queue.
          </div>
        )}
      </div>
    </div>
  );
};
