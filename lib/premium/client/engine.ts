import type { CalcInput, CalcOutput, Gender, PayMode, PlanStd } from "./types";

export const MODAL_FACTORS: Record<PayMode, number> = {
  annual: 1,
  semiannual: 0.52,
  quarterly: 0.265,
  monthly: 0.09,
};

export function calcAgeYears(dobISO: string, asOf = new Date()): number {
  const [y, m, d] = dobISO.split("-").map(Number);
  const dob = new Date(y, (m || 1) - 1, d || 1);
  let age = asOf.getFullYear() - dob.getFullYear();
  const md = asOf.getMonth() - dob.getMonth();
  if (md < 0 || (md === 0 && asOf.getDate() < dob.getDate())) age -= 1;
  return Math.max(0, age);
}

function pickRatePerUnit(
  plan: PlanStd,
  age: number,
  gender: Gender
): number | null {
  if (plan.calc.type === "fixedRatePer1000") {
    return plan.calc.fixedRate ?? null;
  }
  const row = plan.calc.table?.[age];
  if (!row) return null;
  const r = gender === "M" ? row.M : row.F;
  return r ?? null;
}

function applyDiscountPerUnit(plan: PlanStd, sumAssured: number): number {
  // สมมติส่วนลดแบบ: เลือก tier ที่ SA ถึงเกณฑ์สูงสุด แล้วลบออกจาก rate ต่อหน่วย
  const tier = (plan.calc.discounts || []).find((t) => sumAssured >= t.minSum);
  return tier ? tier.discountPer1000 : 0;
}

export function calcPremiumClient(plan: PlanStd, input: CalcInput): CalcOutput {
  const age = calcAgeYears(input.dob);
  if (age < plan.issueAgeMin || age > plan.issueAgeMax) {
    return {
      ok: false,
      message: `อายุ ${age} ปี อยู่นอกช่วงรับประกัน (${plan.issueAgeMin}–${plan.issueAgeMax})`,
    };
  }

  const sa = Math.max(
    plan.minSumAssured,
    Number(input.sumAssured || plan.minSumAssured)
  );

  const rate = pickRatePerUnit(plan, age, input.gender);
  if (rate == null) {
    return {
      ok: false,
      message: `ไม่พบเรทของอายุ ${age} ปี / เพศ ${input.gender}`,
    };
  }

  const unit = plan.calc.unit || 1000;
  const units = sa / unit;

  // หักส่วนลดต่อหน่วย (ถ้ามี)
  const discountPerUnit = applyDiscountPerUnit(plan, sa);
  const effectiveRate = Math.max(0, rate - discountPerUnit);

  const baseAnnual = effectiveRate * units; // เบี้ยรายปีฐานก่อน modal

  const premiums = {
    annual: round2(baseAnnual * MODAL_FACTORS.annual),
    semiannual: round2(baseAnnual * MODAL_FACTORS.semiannual),
    quarterly: round2(baseAnnual * MODAL_FACTORS.quarterly),
    monthly: round2(baseAnnual * MODAL_FACTORS.monthly),
  };

  return {
    ok: true,
    age,
    sumAssured: sa,
    premiums,
    baseAnnual: round2(baseAnnual),
    ratePerUnit: round4(effectiveRate),
  };
}

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}
export function round4(n: number) {
  return Math.round(n * 10000) / 10000;
}
