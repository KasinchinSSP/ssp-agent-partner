import { redirect } from "next/navigation";
import { Suspense } from "react";
import { supabaseServer } from "@/lib/supabaseServer";
import ReferralTools from "@/components/agent/ReferralTools";
import LeadsTable from "@/components/agent/LeadsTable";
import BISTools from "@/components/agent/BISTools";

export const revalidate = 0;

type AgentProfile = {
  code: string;
  name: string | null;
  phone: string | null;
  line: string | null;
  agent_secret: string;
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
  const supabase = supabaseServer();
  const { data } = await supabase
    .from("agent_alias")
    .select("alias,is_active")
    .eq("agent_code", agentCode)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data || null;
}

type LeadRow = {
  id: string;
  full_name: string;
  phone: string;
  age: number | null;
  plan_key: string | null;
  sum_assured: number | null;
  created_at: string;
  ref: string | null;
};

async function getRecentLeads(agentCode: string) {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("leads")
    .select("id, full_name, phone, age, plan_key, sum_assured, created_at, ref")
    .eq("ref", agentCode)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return [];
  return (data as LeadRow[]) || [];
}

export default async function Page({
  searchParams,
}: {
  searchParams: { key?: string };
}) {
  const key = (searchParams?.key || "").trim();
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

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* ซ้าย: ข้อมูล/เครื่องมือแชร์ */}
        <div className="space-y-4 lg:col-span-2">
          <Suspense>
            <ReferralTools agentCode={agent.code} alias={alias} />
          </Suspense>

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="font-semibold text-slate-800">
              Leads ของฉัน (ล่าสุด)
            </div>
            <div className="mt-1 text-xs text-slate-500">
              แสดง 20 รายการล่าสุดจากแบบฟอร์ม /quote ที่มี ref = {agent.code}
            </div>
            <Suspense>
              <LeadsTable rows={leads} />
            </Suspense>
          </section>
        </div>

        {/* ขวา: เครื่องมือ BIS + ข้อมูลโปรไฟล์ */}
        <div className="space-y-4 lg:col-span-1">
          <Suspense>
            <BISTools />
          </Suspense>

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="font-semibold text-slate-800">ข้อมูลโปรไฟล์</div>
            <div className="mt-2 space-y-1 text-sm text-slate-700">
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
            <p className="mt-3 rounded-lg bg-amber-50 p-2 text-[11px] text-amber-700">
              เพื่อความปลอดภัย: เก็บลิงก์นี้ไว้ส่วนตัว หากต้องการเปลี่ยน URL
              โปรดแจ้งผู้ดูแลระบบ
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
