import type { PlanRaw, PlanStd, PlansFile } from "./types";

/**
 * แปลง JSON ดิบจาก /public/data/pla_insurance.json → โครงสร้างมาตรฐานสำหรับเครื่องคำนวณ
 * สมมติค่า default:
 * - unit ของ rate = 1000
 * - เรียง discounts จาก minSum มาก → น้อย เพื่อให้หา tier ที่เหมาะสุดได้ง่าย
 */
export function adaptPlans(raw: PlansFile): PlanStd[] {
  const unit = 1000;
  const list: PlanStd[] = [];

  for (const p of raw.plans || []) {
    if (!p) continue;
    const table: PlanStd["calc"]["table"] = p.rates
      ? Object.fromEntries(
          (p.rates || []).filter(Boolean).map((row: any) => [
            Number(row.age),
            {
              M: row.male != null ? Number(row.male) : undefined,
              F: row.female != null ? Number(row.female) : undefined,
            },
          ])
        )
      : undefined;

    const discounts = (p.discounts || [])
      .filter(Boolean)
      .map((d: any) => ({
        minSum: Number(d.minSum),
        discountPer1000: Number(d.discountPer1000),
      }))
      .sort((a, b) => b.minSum - a.minSum);

    list.push({
      key: p.planKey,
      name: p.planName,
      issueAgeMin: Number(p.ageRange?.min ?? 0),
      issueAgeMax: Number(p.ageRange?.max ?? 99),
      minSumAssured: Number(p.minSumAssured ?? 0),
      calc: {
        type: p.calculationType as any,
        unit,
        fixedRate: p.fixedRate != null ? Number(p.fixedRate) : undefined,
        table,
        discounts,
      },
    });
  }

  return list;
}
