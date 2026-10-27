import Link from "next/link";
import { notFound } from "next/navigation";
import { analysisModules, studyUnits, StudyUnit } from "@/data/analysis-curriculum";
import StudyUnitView from "@/components/study-unit";
import { createSupabaseServerClient } from "@/lib/supabase-server";
export const dynamic = "force-dynamic";

export default async function AnalysisModulePage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const id = Number(moduleId);
  const module = analysisModules.find((item) => item.id === id);
  if (!module) notFound();
  const db=createSupabaseServerClient();
  let moduleTitle=module.title;
  let dbUnits:StudyUnit[]=[];
  if(db){const {data:moduleData}=await db.from("analysis_modules").select("title").eq("id",id).maybeSingle();if(moduleData?.title)moduleTitle=moduleData.title;const {data}=await db.from("analysis_units").select("id,title,published_version").eq("module_id",id).eq("editorial_status","published").not("published_version","is",null).order("position");const fetched=await Promise.all((data||[]).map(async row=>{const {data:version}=await db.from("analysis_unit_versions").select("content").eq("unit_id",row.id).eq("version",row.published_version).eq("editorial_status","published").maybeSingle();if(!version?.content)return studyUnits[id]?.id===row.id?studyUnits[id]:null;const defaults=studyUnits[id]?.id===row.id?studyUnits[id]:{};return {...defaults,...version.content,id:row.id,title:row.title} as StudyUnit}));dbUnits=fetched.filter((u):u is StudyUnit=>Boolean(u));}
  return <main className="wrap" style={{ padding: "48px 0 70px", maxWidth: 850 }}>
    <Link href="/analiza" className="source-link">← Programa de analiză</Link>
    <p style={{ marginTop: 28 }}><span className="pill">Modulul {id}</span></p>
    <h1 className="serif" style={{ fontSize: "clamp(36px,6vw,54px)" }}>{moduleTitle}</h1>
    <p><Link className="btn secondary" href={`/examen?modul=${id}`}>Deschide evaluarea modulului ↗</Link></p>
    {dbUnits.length ? dbUnits.map(unit=><section key={unit.id}><section className="card" style={{ marginTop: 22 }}><span className="pill">Obiective de învățare</span><ul style={{ lineHeight:1.9 }}>{(unit.objectives||[]).map(x=><li key={x}>{x}</li>)}</ul><p><b>Prerechizite:</b> {(unit.prerequisites||[]).join(" · ")||"Nu sunt definite."}</p><p className="muted">Competență urmărită: {unit.competence}</p></section><StudyUnitView unit={unit}/></section>) : studyUnits[id] ? <><section className="card" style={{ marginTop: 22 }}><span className="pill">Obiective de învățare</span><ul style={{ lineHeight:1.9 }}>{studyUnits[id].objectives.map(x=><li key={x}>{x}</li>)}</ul><p><b>Prerechizite:</b> {studyUnits[id].prerequisites.join(" · ")}</p><p className="muted">Competență urmărită: {studyUnits[id].competence}</p></section><StudyUnitView unit={studyUnits[id]} /></> : <div className="card" style={{ marginTop: 28 }}><h2 className="serif" style={{ fontSize: 27, marginTop: 0 }}>Conținutul modulului</h2><p className="muted" style={{ lineHeight: 1.8 }}>Structura modulului este pregătită. Itemii numerotați ai programei și lecțiile aferente nu sunt disponibili în materialele proiectului; unitățile nu au fost inventate.</p><p className="pill" style={{ background: "#f0f2f6", color: "#596477" }}>Structură · în așteptarea programei detaliate</p></div>}
  </main>;
}
