// app/agent/profile/page.tsx
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { supabaseServer } from "@/lib/supabaseServer";
import ReferralTools from "@/components/agent/ReferralTools";
import LeadsTable from "@/components/agent/LeadsTable";
import BISTools from "@/components/agent/BISTools";

export const revalidate = 0;

// getAgentBySecret
const admin = supabaseService();
const { data } = await admin
  .from("agent_profiles")
  .select("code,name,phone,line,agent_secret")
  .eq("agent_secret", key)
  .single();

// getRecentLeads
const admin = supabaseService();
const { data } = await admin
  .from("leads")
  .select("id, full_name, plan_key, gender, age, sum_assured, created_at")
  .eq("ref", agentCode)
  .order("created_at", { ascending: false })
  .limit(20);

type AgentProfile = {
  code: string;
  name: string | null;
  phone: string | null;
  line: string | null;
  agent_secret: string;
};

type LeadRow = {
  id: string;
  fullName: string;
  phone?: string | null;
  planKey: string | null;
  gender: "M" | "F" | null;
  age: number | null;
  sumAssured: number | null;
  createdAt: string; // ISO
};

async function getAgentBySecret(key: string) {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("agent_profiles")
    .select("code,name,phone,line,agent_secret")
    .eq("agent_secret", key)
    .single();

  if (error || !data) return null;
  return data as AgentProfile;
}

async function getAliasByCode(agentCode: string) {
  try {
    const supabase = supabaseServer();
    const { data } = await supabase
      .from("agent_alias")
      .select("alias,is_active,created_at")
      .eq("agent_code", agentCode)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    return data ?? null; // { alias?: string }
  } catch {
    // เผื่อยังไม่มีตาราง/คอลัมน์นี้ ให้ไปต่อได้
    return null;
  }
}

async function getRecentLeads(agentCode: string): Promise<LeadRow[]> {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("leads")
    // ใช้ snake_case ให้ตรง schema แล้ว map เป็น camelCase ภายหลัง
    .select(
      "id, full_name, phone, plan_key, gender, age, sum_assured, created_at"
    )
    .eq("ref", agentCode)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data) return [];
  return data.map((r: any) => ({
    id: r.id,
    fullName: r.full_name,
    phone: r.phone ?? null,
    planKey: r.plan_key ?? null,
    gender: r.gender ?? null,
    age: r.age ?? null,
    sumAssured: r.sum_assured ?? null,
    createdAt: r.created_at,
  }));
}

export default async function Page({
  searchParams,
}: {
  searchParams: { key?: string };
}) {
  const key = searchParams?.key?.trim();
  if (!key) redirect("/");

  const agent = await getAgentBySecret(key);
  if (!agent) redirect("/");

  const aliasRow = await getAliasByCode(agent.code);
  const alias = aliasRow?.alias || null;
  const leads = await getRecentLeads(agent.code);

  return (
    <main className="mx-auto max-w-screen-lg px-4 pb-24 pt-4">
      <h1 className="text-2xl font-semibold text-[var(--brand-life)]">
        โปรไฟล์ตัวแทน (ส่วนตัว)
      </h1>
      <p className="text-sm text-slate-600 mt-1">
        หน้านี้สำหรับตัวแทนเท่านั้น โปรดอย่าส่งลิงก์หน้านี้ให้ลูกค้า
      </p>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ซ้าย: ข้อมูล/เครื่องมือแชร์ */}
        <div className="lg:col-span-2 space-y-4">
          <Suspense>
            <ReferralTools agentCode={agent.code} alias={alias} />
          </Suspense>

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="font-semibold text-slate-800">
              Leads ของฉัน (ล่าสุด)
            </div>
            <div className="text-xs text-slate-500 mt-1">
              แสดง 20 รายการล่าสุดจากแบบฟอร์ม /quote ที่มี ref = {agent.code}
            </div>
            <Suspense>
              {/* rows ใช้ camelCase แล้ว */}
              <LeadsTable rows={leads} />
            </Suspense>
          </section>
        </div>

        {/* ขวา: เครื่องมือ BIS + ข้อมูลโปรไฟล์ */}
        <div className="lg:col-span-1 space-y-4">
          <Suspense>
            <BISTools />
          </Suspense>

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="font-semibold text-slate-800">ข้อมูลโปรไฟล์</div>
            <div className="text-sm text-slate-700 mt-2 space-y-1">
              <div>
                <span className="text-slate-500">รหัสตัวแทน:</span>{" "}
                <b>{agent.code}</b>
              </div>
              <div>
                <span className="text-slate-500">ชื่อ–สกุล:</span>{" "}
                {agent.name || "-"}
              </div>
              <div>
                <span className="text-slate-500">เบอร์โทร:</span>{" "}
                {agent.phone || "-"}
              </div>
              <div>
                <span className="text-slate-500">LINE:</span>{" "}
                {agent.line || "-"}
              </div>
            </div>
            <p className="text-[11px] text-amber-700 bg-amber-50 rounded-lg p-2 mt-3">
              เพื่อความปลอดภัย: เก็บลิงก์นี้ไว้ส่วนตัว หากต้องการเปลี่ยน URL
              โปรดแจ้งผู้ดูแลระบบ
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
