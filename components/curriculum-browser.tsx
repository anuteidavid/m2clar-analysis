"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { analysisModules, optionalExtensions, studyUnits, CurriculumModule } from "@/data/analysis-curriculum";
import { supabase } from "@/lib/supabase";

const worlds = [
  { title: "Fundamente și limbaj", description: "Raționament, funcții, numere reale, șiruri și limite.", ids: [0,1,2,3,4,5] },
  { title: "Schimbare și aproximație", description: "Derivate, teoreme și dezvoltări locale.", ids: [6,7,8] },
  { title: "Integrare", description: "Primitive, integrală definită și integrale improprii.", ids: [9,10,11] },
  { title: "Serii și convergență", description: "Serii numerice, funcționale și de puteri.", ids: [12,13,14] },
  { title: "Mai multe variabile", description: "Calcul diferențial, optimizare și integrale multiple.", ids: [15,16,17,18,19] },
];

export default function CurriculumBrowser() {
  const [query,setQuery]=useState("");
  const [filter,setFilter]=useState("all");
  const [catalog,setCatalog]=useState<CurriculumModule[]>(analysisModules);
  const [order,setOrder]=useState<number[]>(analysisModules.map(m=>m.id));
  const [selected,setSelected]=useState<number[]>(analysisModules.map(m=>m.id));
  const [enabled,setEnabled]=useState<string[]>([]);
  const [progress,setProgress]=useState<Record<number,string>>({});

  useEffect(()=>{
    try {
      const saved=localStorage.getItem("m2clar:program");
      if(saved){const p=JSON.parse(saved);if(Array.isArray(p.order))setOrder(p.order);if(Array.isArray(p.selected))setSelected(p.selected);if(Array.isArray(p.enabled))setEnabled(p.enabled)}
      const marks:Record<number,string>={};
      for(const [id,u] of Object.entries(studyUnits)){
        const raw=localStorage.getItem(`m2clar:unit:${u.id}`);
        if(raw){const r=JSON.parse(raw);marks[Number(id)]=r.reviewWins&&r.conceptWins&&r.independentWins?"Consolidată":r.independentWins?"Rezolvată independent":r.attempts||r.resumeStage>0?"În lucru":"Neîncepută"}
      }
      setProgress(marks);
    } catch { /* keep the unsaved program view usable */ }
    let active=true;
    if(supabase){void supabase.from("analysis_modules").select("id,title,position").order("position").then(({data,error})=>{if(active&&!error&&data){const rows=data as CurriculumModule[];setCatalog(rows);try{if(!localStorage.getItem("m2clar:program"))setOrder(rows.map(m=>m.id))}catch{}}})}
    return()=>{active=false};
  },[]);

  const modules=useMemo(()=>order.map(id=>catalog.find(m=>m.id===id)).filter((m):m is CurriculumModule=>Boolean(m)).filter(m=>selected.includes(m.id)).filter(m=>m.title.toLocaleLowerCase("ro").includes(query.toLocaleLowerCase("ro"))).filter(m=>filter==="all"||(filter==="available"?Boolean(studyUnits[m.id]):filter==="structure"?!studyUnits[m.id]:Boolean(progress[m.id]))),[order,catalog,selected,query,filter,progress]);
  function save(nextOrder:number[],nextEnabled:string[],nextSelected=selected){setOrder(nextOrder);setEnabled(nextEnabled);setSelected(nextSelected);try{localStorage.setItem("m2clar:program",JSON.stringify({order:nextOrder,enabled:nextEnabled,selected:nextSelected}))}catch{}}
  function move(id:number,step:number){const n=[...order],i=n.indexOf(id),j=i+step;if(j<0||j>=n.length)return;[n[i],n[j]]=[n[j],n[i]];save(n,enabled)}
  function toggle(id:number){save(order,enabled,selected.includes(id)?selected.filter(x=>x!==id):[...selected,id])}
  function toggleExtension(name:string){save(order,enabled.includes(name)?enabled.filter(x=>x!==name):[...enabled,name])}

  const started=Object.values(progress).filter(x=>x!=="Neîncepută").length;
  const consolidated=Object.values(progress).filter(x=>x==="Consolidată").length;
  const sequence=order.filter(id=>selected.includes(id)&&studyUnits[id]);
  const current=sequence.find(id=>progress[id]&&progress[id]!=="Consolidată")??sequence[0];

  return <>
    <div className="card curriculum-progress-banner"><div><b>Pașii tăi până acum</b><p className="muted">{started} din 6 lecții începute · {consolidated} consolidate. Numerele se bazează pe activitățile salvate.</p></div><Link className="btn" href={`/analiza/modul/${current??3}`}>Continuă traseul →</Link></div>
    <div className="curriculum-controls"><label>Caută în programă<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ex: limite, serii…" /></label><label>Arată<select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">Toată programa</option><option value="available">Lecții disponibile</option><option value="structure">În pregătire</option><option value="progress">Cu activitate</option></select></label></div>
    <div className="curriculum-worlds" aria-label="Programa organizată în trasee tematice">
      {worlds.map((world,worldIndex)=>{
        const worldModules=modules.filter(module=>world.ids.includes(module.id));
        if(!worldModules.length)return null;
        return <section className="curriculum-world" key={world.title}>
          <div className="world-heading"><span className="world-step">{String(worldIndex+1).padStart(2,"0")}</span><div><h3>{world.title}</h3><p>{world.description}</p></div></div>
          <div className="curriculum-world-path">{worldModules.map(module=>{
            const index=modules.findIndex(m=>m.id===module.id);
            const unit=studyUnits[module.id];
            const status=progress[module.id]||"Neîncepută";
            return <article className={`card curriculum-row world-module ${unit?"world-module-ready":"world-module-pending"}`} key={module.id}>
              <span className="module-number">{String(module.id).padStart(2,"0")}</span>
              <div className="module-copy"><Link href={`/analiza/modul/${module.id}`}><b>{module.title}</b></Link><small className="muted">{unit?`${unit.title} · ${status}`:"Structură importată · itemii detaliați sunt în așteptare."}</small></div>
              <span className={unit?"status-available":"status-label"}>{unit?"Lecție disponibilă":"În pregătire"}</span>
              <div className="order-buttons"><button aria-label={`Mută ${module.title} mai sus`} disabled={index===0} onClick={()=>move(module.id,-1)}>↑</button><button aria-label={`Mută ${module.title} mai jos`} disabled={index===modules.length-1} onClick={()=>move(module.id,1)}>↓</button></div>
              <button className="btn secondary configure" onClick={()=>toggle(module.id)}>{selected.includes(module.id)?"În program ✓":"Adaugă în program"}</button>
            </article>;
          })}</div>
        </section>;
      })}
      {!modules.length&&<p className="card muted">Nu există module pentru căutarea sau filtrul ales.</p>}
    </div>
    <section className="curriculum-extensions"><span className="pill">Pentru programa ta</span><h2 className="serif">Extensii opționale</h2><p className="muted">Activează separat temele suplimentare. Extensiile fără unități publicate apar ca structură în pregătire.</p><div className="extension-grid">{optionalExtensions.map(name=><label className="card extension-option" key={name}><input type="checkbox" checked={enabled.includes(name)} onChange={()=>toggleExtension(name)}/><span><b>{name}</b><small className="muted">Opțional · structură în așteptare</small></span></label>)}</div></section>
    <style>{`.curriculum-progress-banner{margin:24px 0;display:flex;justify-content:space-between;gap:16px;align-items:center;flex-wrap:wrap}.curriculum-progress-banner p{margin:5px 0 0}.curriculum-controls{display:flex;gap:14px;flex-wrap:wrap;margin:20px 0 26px}.curriculum-controls label{display:grid;gap:7px;font-size:13px;font-weight:800}.curriculum-controls input,.curriculum-controls select{min-width:220px;padding:12px;border:1px solid #dbe2ed;border-radius:12px;background:white;font:inherit}.curriculum-world{padding:23px 0;border-top:1px solid var(--line)}.world-heading{display:flex;align-items:center;gap:13px;margin-bottom:15px}.world-step{display:grid;place-items:center;width:42px;height:42px;border-radius:14px;background:#edf1ff;color:var(--blue);font-weight:800}.world-heading h3{margin:0;font-size:20px}.world-heading p{margin:3px 0 0;color:var(--muted);font-size:13px}.curriculum-world-path{display:grid;gap:10px;padding-left:20px;margin-left:21px;border-left:2px dashed #d5dced}.world-module{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:18px}.world-module-ready{border-left:4px solid #67bd83}.world-module-pending{border-left:4px solid #e0e4ec}.module-copy{display:grid;gap:5px;flex:1;min-width:180px}.module-copy a:hover{color:var(--blue)}.module-copy small{font-size:12px}.configure{padding:8px 11px;font-size:12px}.order-buttons{display:flex;gap:4px}.order-buttons button{border:1px solid #dbe2ed;background:white;border-radius:8px;width:32px;height:32px;cursor:pointer}.order-buttons button:disabled{opacity:.35}.curriculum-extensions{margin-top:38px;padding-top:30px;border-top:1px solid var(--line)}.curriculum-extensions h2{font-size:32px;margin:12px 0 5px}.curriculum-extensions>p{max-width:680px;line-height:1.7}.extension-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-top:18px}.extension-option{display:flex;align-items:center;gap:12px;cursor:pointer}.extension-option input{width:18px;height:18px;accent-color:var(--green)}.extension-option small{display:block;margin-top:5px}@media(max-width:720px){.curriculum-world-path{padding-left:12px;margin-left:14px}.world-module{flex-wrap:wrap}.module-copy{min-width:calc(100% - 60px)}.world-module>.status-available,.world-module>.status-label{margin-left:55px}.configure{margin-left:auto}.extension-grid{grid-template-columns:1fr}.curriculum-controls{display:grid;grid-template-columns:1fr}.curriculum-controls input,.curriculum-controls select{min-width:0;width:100%}}`}</style>
  </>;
}
