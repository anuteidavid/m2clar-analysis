import Link from "next/link";
import { analysisModules, studyUnits } from "@/data/analysis-curriculum";
import LearningPath from "@/components/learning-path";

const unitModules = [3, 4, 6, 9, 12, 16];
const stages = ["Intuiție", "Definiție", "Exemplu", "Exersează"];

export default function Home() {
  return <main>
    <section className="wrap home-hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <span className="pill"><span aria-hidden>✦</span> Analiză matematică universitară</span>
          <h1 className="serif">Înțelege analiza <em>pas cu pas.</em></h1>
          <p className="muted">Lecții scurte, exerciții care te ghidează și explicații clare. Înveți o idee, o exersezi, apoi revii la ce merită consolidat.</p>
          <div className="hero-actions">
            <Link className="btn" href="/analiza">Continuă studiul <span aria-hidden>→</span></Link>
            <Link className="btn secondary" href="/plan">Recapitulare</Link>
          </div>
        </div>
        <div className="hero-art" aria-label="O lecție de analiză, împărțită în pași clari">
          <div className="hero-orbit" aria-hidden />
          <span className="hero-spark one" aria-hidden>✳</span><span className="hero-spark two" aria-hidden>✦</span>
          <div className="hero-card">
            <div className="hero-card-head"><span className="pill">Un pas pe rând</span><span aria-hidden style={{fontSize:24}}>∑</span></div>
            <div className="hero-task"><small>O idee, apoi puțină practică</small><strong className="serif">aₙ = 1/n <span style={{color:"var(--green)"}}>→ 0</span></strong></div>
            <div aria-label="Etapele unei unități de învățare" style={{display:"flex",gap:7,marginTop:20,flexWrap:"wrap"}}>{stages.map((stage,i)=><span key={stage} style={{fontSize:11,fontWeight:800,borderRadius:99,padding:"7px 9px",background:i===0?"#eaf7ef":"#f3f5f9",color:i===0?"#278050":"#6c778b"}}>{stage}</span>)}</div>
          </div>
          <div className="hero-badge"><span aria-hidden>☀</span> Învățarea se construiește din pași mici</div>
        </div>
      </div>
    </section>

    <section className="wrap home-path-section" aria-label="Traseul tău de învățare"><LearningPath/></section>

    <section className="wrap home-section" aria-labelledby="how-title">
      <span className="pill">Ritm clar, fără grabă</span>
      <h2 className="serif" id="how-title">Înveți activ, de la idee la înțelegere.</h2>
      <p className="muted section-intro">Fiecare lecție îți oferă un traseu limpede. Indiciile apar când le ceri, iar progresul se bazează pe răspunsurile pe care le-ai rezolvat.</p>
      <div className="steps-grid">
        {[["⌕","Pornești de la intuiție","Leagă definiția de o imagine, un exemplu sau o întrebare simplă."],["∴","Înțelegi condițiile","Vezi notațiile, ipotezele și un exemplu rezolvat pas cu pas."],["✎","Încerci singur","Rezolvă exerciții. Cere un indiciu când ai nevoie și primește feedback clar."],["↻","Revii la ideile-cheie","Consolidează prin probleme noi și urmărește competențele exersate."]].map(([icon,title,copy])=><article className="step-card" key={title}><span className="step-icon" aria-hidden>{icon}</span><b>{title}</b><p>{copy}</p></article>)}
      </div>
    </section>

    <section className="home-section" style={{background:"#fff",borderTop:"1px solid var(--line)",borderBottom:"1px solid var(--line)"}} aria-labelledby="lessons-title">
      <div className="wrap">
        <span className="pill">Lecții disponibile</span>
        <h2 className="serif" id="lessons-title">Începe cu un concept.</h2>
        <p className="muted section-intro">Deschide o lecție, parcurge etapele în ritmul tău și păstrează locul pentru data viitoare. Restul modulelor rămân vizibile în programă, cu statutul lor editorial clar.</p>
        <div className="lesson-grid">{unitModules.map(id=>{const module=analysisModules.find(item=>item.id===id)!;const unit=studyUnits[id];return <Link className="card lesson-card" href={`/analiza/modul/${id}`} key={id}><div className="lesson-meta"><span className="pill">Modulul {String(id).padStart(2,"0")}</span><span className="lesson-arrow" aria-hidden>↗</span></div><h3>{unit.title}</h3><small>{module.title}</small></Link>})}</div>
        <div className="friendly-note"><span aria-hidden>💡</span><p><b>Nu știi de unde să pornești?</b> Explorează programa și alege una dintre lecțiile disponibile. Modulul recomandat se bazează pe progresul salvat, dacă ai început deja.</p></div>
        <div style={{marginTop:22}}><Link href="/analiza" className="source-link">Vezi toate modulele din programă →</Link></div>
      </div>
    </section>

    <section className="wrap home-section" aria-label="Cont și progres">
      <div className="card" style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:20,flexWrap:"wrap",background:"#f0f6ff",borderColor:"#dfe9ff"}}>
        <div><span className="pill">Parcursul tău</span><h2 className="serif" style={{marginBottom:8}}>Un loc pentru ideile care se leagă.</h2><p className="muted" style={{margin:0}}>Progresul tău real se vede în lecții, recapitulări și evaluări.</p></div>
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><Link className="btn" href="/dashboard">Vezi progresul</Link><Link className="btn secondary" href="/cont">Contul meu</Link></div>
      </div>
    </section>
  </main>;
}
