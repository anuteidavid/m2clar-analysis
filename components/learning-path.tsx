"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { analysisModules, studyUnits } from "@/data/analysis-curriculum";
import { currentStreak, localDayKey, pointsForActivity, readXpEvents, XpEvent } from "@/lib/learning-stats";
import { supabase } from "@/lib/supabase";

type UnitProgress = { attempts: number; independentWins: number; conceptWins: number; reviewWins: number; resumeStage: number; state?: string };
type CloudAttempt = { unit_id: string; activity_id: string; created_at: string; is_correct: boolean | null; hint_level: number; used_solution: boolean };
const empty = (): UnitProgress => ({ attempts: 0, independentWins: 0, conceptWins: 0, reviewWins: 0, resumeStage: 0 });
const stageForActivity: Record<string, number> = { "guided-numeric": 4, "independent-numeric": 5, "conceptual-check": 6, "review-numeric": 7 };

function recordStatus(progress: UnitProgress): string {
  if (progress.reviewWins && progress.independentWins && progress.conceptWins) return "Consolidată";
  if (progress.independentWins) return "Rezolvată independent";
  if (progress.attempts || progress.resumeStage > 0) return "În lucru";
  return "Neîncepută";
}

export default function LearningPath({ compact = false }: { compact?: boolean }) {
  const [progress, setProgress] = useState<Record<string, UnitProgress>>({});
  const [xpEvents, setXpEvents] = useState<XpEvent[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [goal, setGoal] = useState(20);
  const [loaded, setLoaded] = useState(false);
  const units = useMemo(() => Object.entries(studyUnits).map(([moduleId, unit]) => ({ moduleId: Number(moduleId), unit })), []);

  useEffect(() => {
    let active = true;
    async function load() {
      const next: Record<string, UnitProgress> = {};
      const localEvents = readXpEvents();
      let studyDays: string[] = [];
      try {
        for (const { unit } of units) {
          const raw = localStorage.getItem(`m2clar:unit:${unit.id}`);
          if (!raw) continue;
          const record = JSON.parse(raw);
          next[unit.id] = {
            attempts: record.attempts || 0,
            independentWins: record.independentWins || 0,
            conceptWins: record.conceptWins || 0,
            reviewWins: record.reviewWins || 0,
            resumeStage: record.resumeStage || 0,
          };
        }
        studyDays = JSON.parse(localStorage.getItem("m2clar:study-days") || "[]");
        const savedGoal = Number(localStorage.getItem("m2clar:daily-goal"));
        if ([10, 20, 30].includes(savedGoal)) setGoal(savedGoal);
      } catch { /* use empty local progress when storage is unavailable */ }

      if (supabase) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const [attemptResult, progressResult] = await Promise.all([
              supabase.from("analysis_attempts").select("unit_id,activity_id,created_at,is_correct,hint_level,used_solution").eq("user_id", user.id),
              supabase.from("analysis_unit_progress").select("unit_id,state,resume_stage").eq("user_id", user.id),
            ]);
            if (!attemptResult.error && !progressResult.error) {
              const attempts = (attemptResult.data || []) as CloudAttempt[];
              for (const { unit } of units) {
                const entries = attempts.filter((attempt) => attempt.unit_id === unit.id);
                const row = next[unit.id] || empty();
                row.attempts = Math.max(row.attempts, entries.length);
                row.independentWins = Math.max(row.independentWins, entries.filter((a) => ["independent-numeric", "assessment"].includes(a.activity_id) && a.is_correct && a.hint_level === 0 && !a.used_solution).length);
                row.conceptWins = Math.max(row.conceptWins, entries.filter((a) => a.activity_id === "conceptual-check" && a.is_correct && a.hint_level === 0 && !a.used_solution).length);
                row.reviewWins = Math.max(row.reviewWins, entries.filter((a) => a.activity_id === "review-numeric" && a.is_correct && a.hint_level === 0 && !a.used_solution).length);
                const cloudState = (progressResult.data || []).find((p) => p.unit_id === unit.id);
                if (cloudState) { row.state = cloudState.state; row.resumeStage = cloudState.resume_stage; }
                next[unit.id] = row;
              }
              const cloudEvents = new Map<string, XpEvent>();
              for (const attempt of attempts) {
                studyDays.push(localDayKey(new Date(attempt.created_at)));
                const stage = stageForActivity[attempt.activity_id];
                const eligible = stage !== undefined || attempt.activity_id === "assessment";
                if (!eligible || !attempt.is_correct) continue;
                const key = `${attempt.unit_id}:${attempt.activity_id}`;
                const points = pointsForActivity(stage ?? 5, attempt.hint_level, attempt.used_solution);
                if (points <= 0) continue;
                const event = { key, day: localDayKey(new Date(attempt.created_at)), points };
                const previous = cloudEvents.get(key);
                if (!previous || event.points > previous.points) cloudEvents.set(key, event);
              }
              const localByKey = new Map(localEvents.map((event) => [event.key, event]));
              for (const event of cloudEvents.values()) if (!localByKey.has(event.key)) localByKey.set(event.key, event);
              if (active) setXpEvents([...localByKey.values()]);
            } else if (active) setXpEvents(localEvents);
          } else if (active) setXpEvents(localEvents);
        } catch { if (active) setXpEvents(localEvents); }
      } else setXpEvents(localEvents);

      if (active) {
        setProgress(next);
        setDays([...new Set(studyDays)].sort());
        setLoaded(true);
      }
    }
    void load();
    return () => { active = false; };
  }, [units]);

  function updateGoal(value: number) {
    setGoal(value);
    try { localStorage.setItem("m2clar:daily-goal", String(value)); } catch { /* goal stays for this view */ }
  }

  const today = localDayKey();
  const todayXp = xpEvents.filter((event) => event.day === today).reduce((sum, event) => sum + event.points, 0);
  const totalXp = xpEvents.reduce((sum, event) => sum + event.points, 0);
  const streak = currentStreak(days, today);
  const firstIncomplete = units.find(({ unit }) => recordStatus(progress[unit.id] || empty()) !== "Consolidată") || units[units.length - 1];
  const continueUnit = firstIncomplete?.unit || units[0]?.unit;

  const worlds = [
    { title:"Șiruri și limite", color:"mint", ids:[3,4] },
    { title:"Schimbare și variație", color:"sky", ids:[6] },
    { title:"Integrare", color:"peach", ids:[9] },
    { title:"Serii", color:"lilac", ids:[12] },
    { title:"Mai multe variabile", color:"gold", ids:[16] },
  ];
  return <section className={`learning-path${compact ? " learning-path-compact" : ""}`} aria-labelledby="path-title">
    <div className="path-summary card">
      <div className="path-summary-copy"><span className="pill">Traseul tău de învățare</span><h2 id="path-title" className="serif">Puțin câte puțin.<br/><em>Pas cu pas.</em></h2><p className="muted">Alege următoarea lecție, răspunde la exerciții și adună XP pe măsură ce înveți.</p><Link className="btn" href={continueUnit ? `/analiza/modul/${firstIncomplete.moduleId}` : "/analiza"}>Continuă lecția <span aria-hidden>→</span></Link></div>
      <div className="path-stats" aria-label="Statistici de învățare"><div className="path-stat xp-stat"><span aria-hidden>✦</span><b>{loaded ? totalXp : "—"} XP</b><small>puncte câștigate</small></div><div className="path-stat streak-stat"><span aria-hidden>🔥</span><b>{loaded ? streak : "—"} zile</b><small>serie de studiu</small></div><div className="daily-goal"><div><b>Obiectivul de azi</b><span>{loaded ? `${todayXp} / ${goal} XP` : "Se încarcă…"}</span></div><div className="goal-track" role="progressbar" aria-label="Progresul obiectivului zilnic" aria-valuemin={0} aria-valuemax={goal} aria-valuenow={Math.min(todayXp, goal)}><span style={{ width: `${Math.min(100, goal ? todayXp / goal * 100 : 0)}%` }}/></div><div className="goal-options" aria-label="Alege obiectivul zilnic">{[10,20,30].map(value=><button key={value} className={goal===value?"goal-selected":""} onClick={()=>updateGoal(value)} aria-pressed={goal===value}>{value} XP</button>)}</div></div></div>
    </div>
    {!compact && <div className="path-map" aria-label="Traseu de lecții">{worlds.map((world,worldIndex)=><section className={`path-world path-world-${world.color}`} key={world.title} aria-labelledby={`world-${worldIndex}`}>
      <div className="path-world-heading"><span className="world-bubble" aria-hidden>{["◌","↗","∫","Σ","∇"][worldIndex]}</span><div><small>PARCURS {String(worldIndex+1).padStart(2,"0")}</small><h3 id={`world-${worldIndex}`}>{world.title}</h3></div><span className="world-count">{world.ids.length} {world.ids.length===1?"lecție":"lecții"}</span></div>
      <div className="path-world-route">{world.ids.map((moduleId,index)=>{
      const unit=studyUnits[moduleId]; if(!unit)return null;
      const record = progress[unit.id] || empty();
      const cloudState = record.state;
      const status = cloudState === "consolidated" ? "Consolidată" : cloudState === "independent" ? "Rezolvată independent" : cloudState === "assisted" ? "Rezolvată cu ajutor" : cloudState === "in_progress" ? "În lucru" : recordStatus(record);
      const next = continueUnit?.id === unit.id;
      const module = analysisModules.find((item)=>item.id===moduleId);
      return <div className={`path-node-wrap path-position-${index%2}`} key={unit.id}>
        <Link className={`path-node ${status === "Consolidată" ? "path-node-done" : ""} ${next ? "path-node-current" : ""}`} href={`/analiza/modul/${moduleId}`} aria-label={`Modulul ${moduleId}, ${unit.title}. ${status}${next?". Lecția recomandată":""}`}>
          <span className="path-node-icon" aria-hidden>{status === "Consolidată" ? "✓" : status === "Neîncepută" ? "★" : "▶"}</span>
          <span className="path-node-text"><small>MODULUL {String(moduleId).padStart(2,"0")} · {status}</small><b>{unit.title}</b><span>{module?.title}</span>{next&&<em>LECȚIA URMĂTOARE →</em>}</span>
        </Link>
      </div>;
    })}</div></section>)}</div>}
    {!compact && <p className="path-footnote muted">Progresul, punctele și seria se actualizează după activități reale. Consultarea soluțiilor nu acordă puncte de exercițiu.</p>}
  </section>;
}
