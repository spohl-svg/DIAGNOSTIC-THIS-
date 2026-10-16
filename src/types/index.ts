export type AppMode = 'OFFICE' | 'DIAGNOSTIC' | 'CUSTOMER_PORTAL';

export interface Vehicle {
  id: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  vin: string;
  licensePlate: string;
  fleetUnitNumber?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  companyName?: string;
  mileage: number;
}

export interface FaultCode {
  code: string;
  system: 'CAN_BUS' | 'POWERTRAIN' | 'CHASSIS' | 'BODY' | 'NETWORK';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  description: string;
  status: 'ACTIVE' | 'PENDING' | 'HISTORIC' | 'RESOLVED';
  affectedCircuit: string;
  connectorLocation: string;
  freezeFrame?: {
    voltage: number;
    rpm: number;
    tempC: number;
  };
}

export interface WireCircuit {
  id: string;
  circuitNumber: string;
  name: string;
  colorCode: string;
  colorName: string;
  gaugeAWG: number;
  expectedVoltage: string;
  measuredVoltage: number;
  measuredResistance: number;
  status: 'HEALTHY' | 'OPEN' | 'SHORT_TO_GROUND' | 'HIGH_RESISTANCE' | 'PARASITIC_DRAW';
  pinFrom: string;
  pinTo: string;
  connectorName: string;
  notes: string;
}

export interface SelfHealingStep {
  stepNumber: number;
  title: string;
  action: string;
  expectedReading: string;
  safetyCheck: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'PASSED' | 'FAILED';
  userNotes?: string;
}

export interface WorkOrderItem {
  id: string;
  type: 'DIAGNOSTIC' | 'LABOR' | 'PART' | 'MISC';
  description: string;
  quantity: number;
  unitPrice: number;
  costPrice: number;
  total: number;
}

export interface WorkOrder {
  id: string;
  orderNumber: string;
  vehicleId: string;
  customerName: string;
  companyName?: string;
  status: 'ESTIMATE' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'PAID';
  createdAt: string;
  dueAt: string;
  items: WorkOrderItem[];
  subtotal: number;
  tax: number;
  deposit: number;
  total: number;
  grossProfit: number;
  profitMarginPercent: number;
  technicianNotes: string;
  customerNotes: string;
  approvedByCustomer: boolean;
  approvalSignature?: string;
  approvalTimestamp?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'WIRE_SPOOL' | 'CONNECTOR' | 'TERMINAL_PIN' | 'RELAY_FUSE' | 'HEAT_SHRINK' | 'TOOLING';
  stockQuantity: number;
  unit: string;
  reorderThreshold: number;
  costPrice: number;
  sellPrice: number;
  binLocation: string;
}

export interface MarketingCampaign {
  id: string;
  title: string;
  campaignType: string;
  targetAudience: string;
  smsSnippet: string;
  emailSubject: string;
  emailBody: string;
  targetPlatforms: string[];
  estimatedLeadValue: string;
  dateCreated: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
}

export interface TwinDiagnosticResult {
  source: string;
  masterTechReport: {
    probableFault: string;
    pinoutProbingPoints: string[];
    isolationSteps: string[];
    safetyWarnings: string[];
  };
  serviceAdvisorReport: {
    customerExplanation: string;
    recommendedRepair: string;
    estimatedLaborHours: number;
    laborRate: number;
    partsCost: number;
    suggestedQuoteTotal: number;
    warrantyOffered: string;
  };
}
