import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient as createServerClient } from "@/lib/supabaseServer";
import ReferralTools from "@/components/agent/ReferralTools";
import LeadsTable from "@/components/agent/LeadsTable";
import BISTools from "@/components/agent/BISTools";

type AgentProfile = {
  code: string; // AG123
  name: string | null;
  phone: string | null;
  line: string | null; // LINE ID หรือ URL
  agent_secret: string; // โทเคนลับ
};

async function getAgentBySecret(key: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from("agent_profiles")
    .select("code,name,phone,line,agent_secret")
    .eq("agent_secret", key)
    .single();
  if (error || !data) return null;
  return data as AgentProfile;
}

async function getAliasByCode(agentCode: string) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("agent_alias")
    .select("alias,is_active")
    .eq("agent_code", agentCode)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data || null; // { alias }
}

async function getRecentLeads(agentCode: string) {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("leads")
    .select("id, fullName, planKey, gender, dob, sumAssured, createdAt")
    .eq("ref", agentCode)
    .order("createdAt", { ascending: false })
    .limit(20);
  return data || [];
}

export default async function Page({
  searchParams,
}: {
  searchParams: { key?: string };
}) {
  const key = searchParams?.key?.trim();
  if (!key) redirect("/");

  const agent = await getAgentBySecret(key);
  if (!agent) {
    // ไม่พบ หรือ key ไม่ถูกต้อง → กลับหน้าแรก
    redirect("/");
  }

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
              <LeadsTable rows={leads || []} />
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
              เพื่อความปลอดภัย: เก็บลิงก์นี้ไว้ส่วนตัว หากต้องการเปลี่ยนโทเคน
              โปรดแจ้งผู้ดูแลระบบ
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
