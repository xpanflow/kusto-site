export const job = {
  id: "DEMO-CN-EU-001",
  cartons: 20,
  weightKg: 400,
  quote: 1200,
  costs: [
    { id: "ocean", amount: 700, zh: "海运", en: "Ocean freight" },
    { id: "pickup", amount: 200, zh: "提货", en: "Pickup" },
    {
      id: "documents",
      amount: 80,
      zh: "单证（待确认）",
      en: "Documents (pending)",
    },
  ],
};
export const tracking = {
  ocean: {
    id: "DEMO-OCEAN-001",
    updated: "2026-06-10T08:00:00Z",
    eta: "2026-06-20T08:00:00Z",
    zh: ["已集货", "已离港", "海上运输", "预计到港"],
    en: ["Collected", "Departed", "At sea", "Expected arrival"],
  },
  air: {
    id: "DEMO-AIR-001",
    updated: "2026-06-10T12:00:00Z",
    eta: "2026-06-12T08:00:00Z",
    zh: ["已接货", "已起飞", "转运中", "预计到达"],
    en: ["Accepted", "Departed", "In transit", "Expected arrival"],
  },
};
