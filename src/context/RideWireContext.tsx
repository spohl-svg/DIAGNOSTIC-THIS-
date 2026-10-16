import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AppMode,
  Vehicle,
  FaultCode,
  WireCircuit,
  WorkOrder,
  InventoryItem,
  MarketingCampaign,
  SelfHealingStep,
  TwinDiagnosticResult,
} from '../types';
import {
  INITIAL_VEHICLES,
  INITIAL_FAULT_CODES,
  INITIAL_CIRCUITS,
  INITIAL_WORK_ORDERS,
  INITIAL_INVENTORY,
  INITIAL_CAMPAIGNS,
} from '../store/initialData';

interface MultimeterState {
  voltage: number;
  resistance: number;
  currentMA: number;
  canHigh: number;
  canLow: number;
  frequencyHz: number;
  mode: 'DC_VOLTS' | 'OHMS' | 'MILLIAMPS' | 'CAN_SCOPE';
  hold: boolean;
}

interface RideWireContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  vehicles: Vehicle[];
  activeVehicle: Vehicle;
  setActiveVehicleId: (id: string) => void;
  addVehicle: (v: Vehicle) => void;
  circuits: WireCircuit[];
  selectedCircuit: WireCircuit | null;
  selectCircuit: (id: string | null) => void;
  updateCircuit: (id: string, updates: Partial<WireCircuit>) => void;
  faultCodes: FaultCode[];
  resolveFaultCode: (code: string) => void;
  clearAllFaults: () => void;
  workOrders: WorkOrder[];
  activeWorkOrder: WorkOrder | null;
  setActiveWorkOrderId: (id: string | null) => void;
  addWorkOrder: (order: WorkOrder) => void;
  updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => void;
  approveWorkOrder: (id: string, signature: string) => void;
  inventory: InventoryItem[];
  updateInventoryStock: (id: string, delta: number) => void;
  campaigns: MarketingCampaign[];
  addCampaign: (campaign: MarketingCampaign) => void;
  multimeter: MultimeterState;
  setMultimeterMode: (mode: MultimeterState['mode']) => void;
  toggleMultimeterHold: () => void;
  probeCircuit: (circuit: WireCircuit) => void;
  probingCircuitId: string | null;
  selfHealingSteps: SelfHealingStep[];
  updateSelfHealingStep: (stepNumber: number, status: SelfHealingStep['status'], notes?: string) => void;
  resetSelfHealing: () => void;
  executeSelfHealingRepair: () => void;
  twinReport: TwinDiagnosticResult | null;
  isTwinDiagnosing: boolean;
  runTwinDiagnosis: (customSymptom?: string) => Promise<void>;
  generateMarketingCampaign: (type: string, audience: string, goal: string, offer: string) => Promise<MarketingCampaign | null>;
  isMarketingGenerating: boolean;
}

const RideWireContext = createContext<RideWireContextType | null>(null);

const DEFAULT_SELF_HEALING_STEPS: SelfHealingStep[] = [
  {
    stepNumber: 1,
    title: 'Verify B+ Supply to Relay R3 Contactor',
    action: 'Back-probe Terminal 30 on Relay R3 with DMM. Check for stable 12.6V battery potential under headlamp load.',
    expectedReading: '12.40V - 12.70V DC',
    safetyCheck: 'Ensure probes have insulated rubber boots to prevent chassis shorting.',
    status: 'PASSED',
    userNotes: 'Measured 12.58V steady at Terminal 30.',
  },
  {
    stepNumber: 2,
    title: 'Ground Stud G102 Contact Impedance Isolation',
    action: 'Measure voltage drop between ECM chassis housing and negative battery terminal while key-on.',
    expectedReading: '< 0.08V Drop Max',
    safetyCheck: 'Do not disconnect battery while ignition is switched ON.',
    status: 'IN_PROGRESS',
    userNotes: 'Currently reading 0.82V drop. Star washer loose on frame rail.',
  },
  {
    stepNumber: 3,
    title: 'CAN-Bus Backbone Differential Termination Test',
    action: 'Disconnect battery negative terminal. Measure resistance across DLC Pin 6 (CAN-H) and Pin 14 (CAN-L).',
    expectedReading: '60.0 Ohms (± 3 Ohms) for dual parallel 120Ω resistors',
    safetyCheck: 'Resistance must ONLY be measured with vehicle battery disconnected.',
    status: 'PENDING',
    userNotes: '',
  },
  {
    stepNumber: 4,
    title: 'Harness Flex Strain & Splice S104 Continuity Verification',
    action: 'Connect DMM continuity beeper to Circuit 15 wire while gently flexing the main harness neck at firewall.',
    expectedReading: 'Continuous solid tone (0.00Ω with zero intermittent cutouts)',
    safetyCheck: 'Check for sharp metal bracket edges cutting through outer nylon loom.',
    status: 'PENDING',
    userNotes: '',
  },
];

export const RideWireProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<AppMode>('OFFICE');

  // Vehicles
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('rw_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });
  const [activeVehicleId, setActiveVehicleId] = useState<string>(vehicles[0]?.id || 'veh-001');

  // Circuits
  const [circuits, setCircuits] = useState<WireCircuit[]>(() => {
    const saved = localStorage.getItem('rw_circuits');
    return saved ? JSON.parse(saved) : INITIAL_CIRCUITS;
  });
  const [selectedCircuitId, setSelectedCircuitId] = useState<string | null>('circ-1');
  const [probingCircuitId, setProbingCircuitId] = useState<string | null>('circ-1');

  // Fault codes
  const [faultCodes, setFaultCodes] = useState<FaultCode[]>(() => {
    const saved = localStorage.getItem('rw_faults');
    return saved ? JSON.parse(saved) : INITIAL_FAULT_CODES;
  });

  // Work Orders
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => {
    const saved = localStorage.getItem('rw_work_orders');
    return saved ? JSON.parse(saved) : INITIAL_WORK_ORDERS;
  });
  const [activeWorkOrderId, setActiveWorkOrderId] = useState<string | null>(workOrders[0]?.id || null);

  // Inventory
  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('rw_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  // Marketing
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(() => {
    const saved = localStorage.getItem('rw_campaigns');
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  // Self Healing
  const [selfHealingSteps, setSelfHealingSteps] = useState<SelfHealingStep[]>(() => {
    const saved = localStorage.getItem('rw_self_heal');
    return saved ? JSON.parse(saved) : DEFAULT_SELF_HEALING_STEPS;
  });

  // Multimeter
  const [multimeter, setMultimeter] = useState<MultimeterState>({
    voltage: 1.15,
    resistance: 124.5,
    currentMA: 480,
    canHigh: 2.7,
    canLow: 2.3,
    frequencyHz: 250,
    mode: 'DC_VOLTS',
    hold: false,
  });

  // Gemini Twin
  const [twinReport, setTwinReport] = useState<TwinDiagnosticResult | null>(null);
  const [isTwinDiagnosing, setIsTwinDiagnosing] = useState(false);
  const [isMarketingGenerating, setIsMarketingGenerating] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('rw_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('rw_circuits', JSON.stringify(circuits));
  }, [circuits]);

  useEffect(() => {
    localStorage.setItem('rw_faults', JSON.stringify(faultCodes));
  }, [faultCodes]);

  useEffect(() => {
    localStorage.setItem('rw_work_orders', JSON.stringify(workOrders));
  }, [workOrders]);

  useEffect(() => {
    localStorage.setItem('rw_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('rw_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem('rw_self_heal', JSON.stringify(selfHealingSteps));
  }, [selfHealingSteps]);

  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId) || vehicles[0];
  const selectedCircuit = circuits.find((c) => c.id === selectedCircuitId) || null;
  const activeWorkOrder = workOrders.find((w) => w.id === activeWorkOrderId) || workOrders[0] || null;

  const addVehicle = (v: Vehicle) => {
    setVehicles((prev) => [v, ...prev]);
    setActiveVehicleId(v.id);
  };

  const selectCircuit = (id: string | null) => {
    setSelectedCircuitId(id);
    if (id) {
      const circ = circuits.find((c) => c.id === id);
      if (circ) {
        probeCircuit(circ);
      }
    }
  };

  const updateCircuit = (id: string, updates: Partial<WireCircuit>) => {
    setCircuits((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const resolveFaultCode = (code: string) => {
    setFaultCodes((prev) =>
      prev.map((f) => (f.code === code ? { ...f, status: 'RESOLVED' } : f))
    );
  };

  const clearAllFaults = () => {
    setFaultCodes((prev) => prev.map((f) => ({ ...f, status: 'RESOLVED' })));
  };

  const addWorkOrder = (order: WorkOrder) => {
    setWorkOrders((prev) => [order, ...prev]);
    setActiveWorkOrderId(order.id);
  };

  const updateWorkOrder = (id: string, updates: Partial<WorkOrder>) => {
    setWorkOrders((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const updated = { ...w, ...updates };
          // Recalculate totals if items changed
          if (updates.items) {
            const subtotal = updates.items.reduce((sum, item) => sum + item.total, 0);
            const costTotal = updates.items.reduce((sum, item) => sum + item.costPrice * item.quantity, 0);
            const tax = +(subtotal * 0.08).toFixed(2);
            const total = +(subtotal + tax).toFixed(2);
            const grossProfit = +(subtotal - costTotal).toFixed(2);
            const profitMarginPercent = subtotal > 0 ? +((grossProfit / subtotal) * 100).toFixed(1) : 0;
            return {
              ...updated,
              subtotal,
              tax,
              total,
              grossProfit,
              profitMarginPercent,
            };
          }
          return updated;
        }
        return w;
      })
    );
  };

  const approveWorkOrder = (id: string, signature: string) => {
    const timestamp = new Date().toISOString();
    updateWorkOrder(id, {
      approvedByCustomer: true,
      approvalSignature: signature,
      approvalTimestamp: timestamp,
      status: 'APPROVED',
    });
  };

  const updateInventoryStock = (id: string, delta: number) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, stockQuantity: Math.max(0, item.stockQuantity + delta) }
          : item
      )
    );
  };

  const addCampaign = (campaign: MarketingCampaign) => {
    setCampaigns((prev) => [campaign, ...prev]);
  };

  const setMultimeterMode = (mode: MultimeterState['mode']) => {
    setMultimeter((prev) => ({ ...prev, mode }));
  };

  const toggleMultimeterHold = () => {
    setMultimeter((prev) => ({ ...prev, hold: !prev.hold }));
  };

  const probeCircuit = (circuit: WireCircuit) => {
    setProbingCircuitId(circuit.id);
    if (multimeter.hold) return;

    // Simulate real probe readings based on circuit condition
    setMultimeter((prev) => ({
      ...prev,
      voltage: circuit.measuredVoltage,
      resistance: circuit.measuredResistance,
      currentMA: circuit.status === 'PARASITIC_DRAW' ? 480 : 25,
      canHigh: circuit.circuitNumber.includes('CAN') ? 2.68 : 0,
      canLow: circuit.circuitNumber.includes('CAN') ? 2.32 : 0,
    }));
  };

  const updateSelfHealingStep = (
    stepNumber: number,
    status: SelfHealingStep['status'],
    notes?: string
  ) => {
    setSelfHealingSteps((prev) =>
      prev.map((s) =>
        s.stepNumber === stepNumber
          ? { ...s, status, ...(notes !== undefined ? { userNotes: notes } : {}) }
          : s
      )
    );
  };

  const resetSelfHealing = () => {
    setSelfHealingSteps(DEFAULT_SELF_HEALING_STEPS);
  };

  const executeSelfHealingRepair = () => {
    // Mark all steps as passed
    setSelfHealingSteps((prev) =>
      prev.map((s) => ({
        ...s,
        status: 'PASSED',
        userNotes: s.userNotes || 'Remediated & verified under dynamic electrical load.',
      }))
    );

    // Heal high resistance circuits
    setCircuits((prev) =>
      prev.map((c) => {
        if (c.id === 'circ-1') {
          return {
            ...c,
            status: 'HEALTHY',
            measuredVoltage: 2.68,
            measuredResistance: 59.8,
            notes: 'Self-Healing Protocol Completed: Termination loop resoldered with dual-wall seal. 60.0Ω spec restored.',
          };
        }
        if (c.id === 'circ-3') {
          return {
            ...c,
            status: 'HEALTHY',
            measuredVoltage: 13.8,
            measuredResistance: 0.05,
            notes: 'Splice S104 excised and re-terminated. Zero voltage drop under 10A load.',
          };
        }
        if (c.id === 'circ-4') {
          return {
            ...c,
            status: 'HEALTHY',
            measuredVoltage: 0.02,
            measuredResistance: 0.02,
            notes: 'Ground stud G102 wire-brushed, re-torqued, and protected with dielectric seal.',
          };
        }
        return c;
      })
    );

    // Resolve U0100 & P0685
    resolveFaultCode('U0100');
    resolveFaultCode('P0685');

    // Update multimeter
    setMultimeter((prev) => ({
      ...prev,
      voltage: 13.8,
      resistance: 60.0,
      currentMA: 32,
    }));
  };

  const runTwinDiagnosis = async (customSymptom?: string) => {
    setIsTwinDiagnosing(true);
    try {
      const activeFaults = faultCodes.filter((f) => f.status === 'ACTIVE').map((f) => f.code);
      const res = await fetch('/api/twin/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle: activeVehicle,
          symptom: customSymptom || 'Intermittent loss of ECM communication during fleet drive cycles',
          faultCodes: activeFaults,
          readings: {
            voltage: multimeter.voltage,
            resistance: multimeter.resistance,
            canHigh: multimeter.canHigh,
            canLow: multimeter.canLow,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setTwinReport(data);
      }
    } catch (err) {
      console.error('Twin diagnosis failed:', err);
    } finally {
      setIsTwinDiagnosing(false);
    }
  };

  const generateMarketingCampaign = async (
    type: string,
    audience: string,
    goal: string,
    offer: string
  ): Promise<MarketingCampaign | null> => {
    setIsMarketingGenerating(true);
    try {
      const res = await fetch('/api/twin/marketing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignType: type,
          targetAudience: audience,
          promotionGoal: goal,
          discountOffer: offer,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.campaign) {
          const newCamp: MarketingCampaign = {
            id: `camp-${Date.now()}`,
            title: data.campaign.title || 'RideWire High-Uptime Campaign',
            campaignType: type,
            targetAudience: audience,
            smsSnippet: data.campaign.smsSnippet || '',
            emailSubject: data.campaign.emailSubject || '',
            emailBody: data.campaign.emailBody || '',
            targetPlatforms: data.campaign.targetPlatforms || ['SMS Direct', 'Fleet Email'],
            estimatedLeadValue: data.campaign.estimatedLeadValue || '$1,500+',
            dateCreated: new Date().toISOString().split('T')[0],
            status: 'ACTIVE',
          };
          addCampaign(newCamp);
          return newCamp;
        }
      }
    } catch (err) {
      console.error('Failed to generate campaign:', err);
    } finally {
      setIsMarketingGenerating(false);
    }
    return null;
  };

  return (
    <RideWireContext.Provider
      value={{
        mode,
        setMode,
        vehicles,
        activeVehicle,
        setActiveVehicleId,
        addVehicle,
        circuits,
        selectedCircuit,
        selectCircuit,
        updateCircuit,
        faultCodes,
        resolveFaultCode,
        clearAllFaults,
        workOrders,
        activeWorkOrder,
        setActiveWorkOrderId,
        addWorkOrder,
        updateWorkOrder,
        approveWorkOrder,
        inventory,
        updateInventoryStock,
        campaigns,
        addCampaign,
        multimeter,
        setMultimeterMode,
        toggleMultimeterHold,
        probeCircuit,
        probingCircuitId,
        selfHealingSteps,
        updateSelfHealingStep,
        resetSelfHealing,
        executeSelfHealingRepair,
        twinReport,
        isTwinDiagnosing,
        runTwinDiagnosis,
        generateMarketingCampaign,
        isMarketingGenerating,
      }}
    >
      {children}
    </RideWireContext.Provider>
  );
};

export const useRideWire = () => {
  const context = useContext(RideWireContext);
  if (!context) {
    throw new Error('useRideWire must be used within a RideWireProvider');
  }
  return context;
};
