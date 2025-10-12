export type Gender = "M" | "F";
export type PayMode = "annual" | "semiannual" | "quarterly" | "monthly";

export interface PlanRaw {
  planKey: string;
  planName: string;
  ageRange: { min: number; max: number };
  minSumAssured: number; // ทุนขั้นต่ำ
  calculationType: "rateTable" | "fixedRatePer1000";
  fixedRate?: number | null; // เบี้ยต่อทุนหน่วยฐาน (เช่น ต่อ 1,000) กรณี fixed
  rates?: Array<{
    age: number;
    female?: number | null;
    male?: number | null;
  } | null> | null; // กรณีใช้ตารางเรท
  discounts?: Array<{ minSum: number; discountPer1000: number } | null> | null; // ส่วนลดต่อหน่วย เมื่อ SA ถึงเกณฑ์
}

export interface PlansFile {
  fileInfo?: { version?: string; description?: string; lastUpdated?: string };
  plans: PlanRaw[];
}

// โครงสร้างมาตรฐานหลังแปลง (Adapter)
export interface PlanStd {
  key: string; // ใช้ทำ route /products/[key]
  name: string; // ชื่อโชว์บนหน้าเว็บ
  issueAgeMin: number;
  issueAgeMax: number;
  minSumAssured: number;
  calc: {
    type: "rateTable" | "fixedRatePer1000";
    unit: number; // หน่วยทุนของ rate เช่น 1000 (สมมติ default = 1000)
    fixedRate?: number; // ถ้าเป็น fixed
    table?: Record<number, { M?: number; F?: number }>; // age → rate ต่อหน่วย
    discounts?: Array<{ minSum: number; discountPer1000: number }>; // เรียง minSum สูง→ต่ำ
  };
}

export interface CalcInput {
  planKey: string;
  gender: Gender;
  dob: string; // YYYY-MM-DD (ค.ศ.)
  sumAssured?: number; // ถ้าไม่ส่ง จะใช้ min ของแผน
  payMode?: PayMode; // ใช้โชว์ผลเบื้องต้น (default: annual)
}

export interface CalcOutput {
  ok: boolean;
  message?: string;
  age?: number; // ปีเต็ม ณ วันนี้
  sumAssured?: number;
  premiums?: {
    annual: number;
    semiannual: number;
    quarterly: number;
    monthly: number;
  };
  baseAnnual?: number; // เบี้ยรายปีฐานก่อนคูณ modal
  ratePerUnit?: number; // เรทต่อหน่วยทุน (เช่น ต่อ 1,000)
}
