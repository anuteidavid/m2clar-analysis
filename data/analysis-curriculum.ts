export type CurriculumModule = { id: number; title: string; optional?: boolean };

// These are the module headings supplied in the request. Numbered learning
// units are intentionally not inferred; import them from the detailed syllabus.
export const analysisModules: CurriculumModule[] = [
  { id: 0, title: "Limbaj matematic și raționament" },
  { id: 1, title: "Calcul algebric și funcții elementare" },
  { id: 2, title: "Numere reale și structura dreptei reale" },
  { id: 3, title: "Șiruri numerice" },
  { id: 4, title: "Limite de funcții" },
  { id: 5, title: "Continuitate" },
  { id: 6, title: "Derivare și diferențiabilitate" },
  { id: 7, title: "Teoreme de calcul diferențial și aplicații" },
  { id: 8, title: "Formula Taylor și aproximări locale" },
  { id: 9, title: "Primitive și metode de integrare" },
  { id: 10, title: "Integrala definită" },
  { id: 11, title: "Integrale improprii" },
  { id: 12, title: "Serii numerice" },
  { id: 13, title: "Șiruri și serii de funcții" },
  { id: 14, title: "Serii de puteri și serii Taylor" },
  { id: 15, title: "Spațiul Rⁿ, limite și continuitate" },
  { id: 16, title: "Calcul diferențial în mai multe variabile" },
  { id: 17, title: "Extreme și optimizare" },
  { id: 18, title: "Integrale duble și triple" },
  { id: 19, title: "Integrale curbilinii, de suprafață și calcul vectorial" },
];

export const optionalExtensions = [
  "Integrale cu parametru", "Funcțiile Gamma și Beta", "Serii Fourier",
  "Ecuații diferențiale", "Spații metrice", "Integrare Lebesgue",
];

export type StudyUnit = {
  id: string; title: string; objectives: string[]; prerequisites: string[]; prerequisiteIds?:string[];
  diagnosticQuestion?:string; diagnosticOptions?:{id:string;label:string;correct:boolean;feedback:string}[];
  guidedQuestion?: string; guidedOptions?: { id:string;label:string;correct:boolean;feedback:string }[];
  intuition: string; definition: string; example: string; question: string;
  answer: number; tolerance: number; independentQuestion?: string; independentAnswer?: number; independentSolution?: string[];
  conceptualQuestion?: string; conceptualAnswer?: number; conceptualSolution?: string[];
  conceptualOptions?: { id:string; label:string; correct:boolean; feedback:string }[];
  reviewQuestion?: string; reviewAnswer?: number; reviewSolution?: string[];
  answerMode?: "numeric" | "expression"; expectedExpression?: string; hint: string; nextStep: string;
  solution: string[]; competence: string; difficulty: "Introductiv" | "Mediu";
  minutes: number; editorialStatus: "published" | "structure"; author?:string; sources?:string[]; version?:number; updatedAt?:string;
};

// Initial original sample lessons. Other modules keep their syllabus structure
// until the numbered items from the user's source program are imported.
export const studyUnits: Record<number, StudyUnit> = {
  3: { id:"am-03-01", title:"Convergența unui șir", objectives:["Folosirea definiției convergenței", "Estimarea limitei unui șir"], prerequisites:["Modulul 2: valoare absolută și inegalități"], intuition:"Termenii șirului $a_n=1/n$ se apropie de $0$. Pentru orice distanță ε față de 0, după un anumit indice toți termenii rămân în acea distanță.", definition:"Șirul $(a_n)$ converge la $L$ dacă pentru orice $\\varepsilon>0$ există $N$ astfel încât $n\\ge N$ implică $|a_n-L|<\\varepsilon$.", example:"Pentru $a_n=1/n$, alegem $N>1/\\varepsilon$. Atunci $n\\ge N$ implică $0<1/n\\le1/N<\\varepsilon$, deci limita este $0$.", question:"Determină limita șirului $a_n=(3n+1)/(n+2)$. Scrie valoarea numerică a limitei.", answer:3,tolerance:1e-8,independentQuestion:"Calculează limita pentru $a_n=(5n-2)/(n+1)$.",independentAnswer:5,independentSolution:["Împarte numărătorul și numitorul la $n$.","Obții $(5-2/n)/(1+1/n)$, care tinde la $5$."],conceptualQuestion:"Un șir monoton și mărginit este convergent? Introdu 1 pentru da, 0 pentru nu.",conceptualAnswer:1,conceptualSolution:["Da. Acesta este teorema convergenței monotone pentru șiruri reale."],reviewQuestion:"Calculează limita pentru $a_n=(2n^2+n)/(n^2+3)$.",reviewAnswer:2,reviewSolution:["Împarte la $n^2$.","Obții $(2+1/n)/(1+3/n^2)$, deci limita este $2$."],hint:"Împarte numărătorul și numitorul la cea mai mare putere a lui n.",nextStep:"Compară coeficienții termenilor de grad maxim.",solution:["$a_n=(3+1/n)/(1+2/n)$. ","Când $n\\to\\infty$, avem $1/n\\to0$.","Prin regulile limitelor, limita este $3/1=3$."],competence:"Calculul limitelor de șiruri",difficulty:"Introductiv",minutes:18,editorialStatus:"published" },
  4: { id:"am-04-01", title:"Limite și forme nedeterminate", objectives:["Identificarea formei 0/0", "Simplificarea expresiei înainte de trecerea la limită"],prerequisites:["Modulul 1: factorizarea polinoamelor", "Modulul 3: limite de șiruri"],intuition:"O funcție poate să nu fie definită într-un punct, deși valorile ei din apropiere se apropie de un număr bine determinat.",definition:"$\\lim_{x\\to a}f(x)=L$ dacă valorile lui $f(x)$ pot fi făcute arbitrar de apropiate de $L$ alegând $x$ suficient de aproape de $a$, cu $x\\ne a$.",example:"Pentru $x\\ne1$, $(x^2-1)/(x-1)=x+1$. De aceea limita la $x\\to1$ este $2$, deși expresia inițială nu este definită la $1$.",question:"Calculează $\\lim_{x\\to2}(x^2-4)/(x-2)$. Răspunde cu valoarea limitei.",answer:4,tolerance:1e-8,independentQuestion:"Calculează $\\lim_{x\\to3}(x^2-9)/(x-3)$.",independentAnswer:6,independentSolution:["$x^2-9=(x-3)(x+3)$. ","Pentru $x\\ne3$ simplificăm factorul și obținem limita $6$."],conceptualQuestion:"Cât este $\\lim_{x\\to0}\\sin(x)/x$? Introdu valoarea limitei.",conceptualAnswer:1,conceptualSolution:["Limita fundamentală trigonometrică este $1$."],reviewQuestion:"Calculează $\\lim_{x\\to2}(x^3-8)/(x-2)$.",reviewAnswer:12,reviewSolution:["$x^3-8=(x-2)(x^2+2x+4)$. ","Evaluăm factorul rămas în $2$: $4+4+4=12$."],hint:"Numărătorul este o diferență de pătrate.",nextStep:"Factorizează x²−4 și simplifică factorul x−2 pentru x≠2.",solution:["$x^2-4=(x-2)(x+2)$. ","Pentru $x\\ne2$, raportul se reduce la $x+2$.","Limita este $2+2=4$."],competence:"Transformarea formelor nedeterminate",difficulty:"Introductiv",minutes:20,editorialStatus:"published" },
  6: { id:"am-06-01", title:"Derivata ca rată de variație",objectives:["Interpretarea derivatei", "Aplicarea regulilor de derivare"],prerequisites:["Modulul 4: limite de funcții"],intuition:"Panta secantei prin două puncte ale graficului tinde spre panta tangentei când punctele se apropie.",definition:"f′(a)=limₕ→0 (f(a+h)−f(a))/h, dacă limita există și este finită.",example:"Pentru f(x)=x², raportul incremental este ((x+h)²−x²)/h=2x+h, deci f′(x)=2x.",question:"Pentru f(x)=x³, care este valoarea lui f′(2)?",answer:12,tolerance:1e-8,independentQuestion:"Dacă f(x)=x⁴, calculează f′(2).",independentAnswer:32,independentSolution:["Regula puterii dă f′(x)=4x³.","f′(2)=4·8=32."],conceptualQuestion:"Dacă o funcție este diferențiabilă într-un punct, este și continuă acolo? Introdu 1 pentru da, 0 pentru nu.",conceptualAnswer:1,conceptualSolution:["Da. Diferențiabilitatea implică continuitatea; reciproca nu este adevărată în general."],reviewQuestion:"Pentru f(x)=x²+2x, calculează f′(1).",reviewAnswer:4,reviewSolution:["f′(x)=2x+2.","f′(1)=4."],hint:"Derivata lui x la puterea n este n·x la puterea n−1.",nextStep:"Aplică regula puterii și evaluează la x=2.",solution:["f′(x)=3x².","f′(2)=3·2²=12."],competence:"Calculul derivatelor",difficulty:"Introductiv",minutes:16,editorialStatus:"published" },
  9: { id:"am-09-01", title:"Primitive și constanta de integrare",objectives:["Recunoașterea unei primitive", "Folosirea constantei de integrare"],prerequisites:["Modulul 6: reguli de derivare"],intuition:"Integrarea nedefinită inversează derivarea: căutăm funcții cu aceeași derivată.",definition:"F este o primitivă a lui f pe un interval I dacă F′(x)=f(x) pentru orice x∈I. Toate primitivele pe un interval sunt F(x)+C.",example:"Deoarece (x³/3)′=x², primitivele lui x² sunt x³/3+C.",question:"Calculează ∫₀² 2x dx. Introdu valoarea numerică.",answer:4,tolerance:1e-8,independentQuestion:"Calculează ∫₀² 3x² dx.",independentAnswer:8,independentSolution:["O primitivă este x³.","Evaluarea la capete dă 8−0=8."],conceptualQuestion:"Dacă F este primitivă a lui f, este adevărat că F′=f? Introdu 1 pentru da, 0 pentru nu.",conceptualAnswer:1,conceptualSolution:["Da. Aceasta este definiția unei primitive."],reviewQuestion:"Calculează ∫₀¹(2x+1)dx.",reviewAnswer:2,reviewSolution:["O primitivă este x²+x.","La capete: 2−0=2."],hint:"O primitivă a lui 2x este x².",nextStep:"Evaluează x² la capătul superior și scade valoarea la capătul inferior.",solution:["O primitivă este F(x)=x².","∫₀²2x dx=F(2)−F(0)=4−0=4."],competence:"Calculul integralelor elementare",difficulty:"Introductiv",minutes:18,editorialStatus:"published" },
  12: { id:"am-12-01", title:"Convergența seriilor numerice",objectives:["Legătura dintre serie și șirul sumelor parțiale", "Aplicarea criteriului geometric"],prerequisites:["Modulul 3: limite de șiruri"],intuition:"O serie infinită converge dacă sumele parțiale se stabilizează către o limită finită.",definition:"Seria Σaₙ converge dacă șirul sumelor parțiale sₙ=Σₖ₌₁ⁿaₖ are limită finită.",example:"Pentru |q|<1, Σₙ₌₀∞qⁿ=1/(1−q). Dacă |q|≥1, termenul general nu tinde la zero, deci seria diverge.",question:"Calculează suma Σₙ₌₀∞(1/2)ⁿ. Introdu valoarea numerică.",answer:2,tolerance:1e-8,independentQuestion:"Calculează suma seriei Σₙ₌₀∞(1/3)ⁿ.",independentAnswer:1.5,independentSolution:["q=1/3, cu |q|<1.","S=1/(1−1/3)=3/2."],conceptualQuestion:"Dacă termenul general al unei serii nu tinde la zero, seria poate converge? Introdu 1 pentru da, 0 pentru nu.",conceptualAnswer:0,conceptualSolution:["Nu. Condiția aₙ→0 este necesară pentru convergența seriei."],reviewQuestion:"Calculează suma seriei geometrice Σₙ₌₀∞(1/4)ⁿ.",reviewAnswer:4/3,reviewSolution:["Rația este 1/4, deci seria converge.","S=1/(1−1/4)=4/3."],hint:"Este o serie geometrică cu primul termen 1 și rația 1/2.",nextStep:"Folosește suma a/(1−q), valabilă când |q|<1.",solution:["a=1 și q=1/2, cu |q|<1.","S=a/(1−q)=1/(1−1/2)=2."],competence:"Criterii de convergență și sume",difficulty:"Introductiv",minutes:22,editorialStatus:"published" },
  16: { id:"am-16-01", title:"Derivate parțiale și gradient",objectives:["Calcularea derivatelor parțiale", "Interpretarea gradientului"],prerequisites:["Modulul 6: reguli de derivare", "Modulul 15: funcții de mai multe variabile"],intuition:"Pentru a măsura schimbarea unei funcții de două variabile pe o direcție coordonată, păstrăm cealaltă variabilă fixă.",definition:"∂f/∂x(a,b)=limₕ→0[f(a+h,b)−f(a,b)]/h. Gradientul este vectorul derivatelor parțiale: ∇f=(fₓ,fᵧ).",example:"Pentru f(x,y)=x²+xy, fₓ=2x+y, iar fᵧ=x. La (1,2), gradientul este (4,1).",question:"Pentru f(x,y)=x²+3y², calculează ∂f/∂y în punctul (1,2).",answer:12,tolerance:1e-8,independentQuestion:"Pentru f(x,y)=2x²+y², calculează ∂f/∂y în (2,3).",independentAnswer:6,independentSolution:["La derivarea după y, x este constant.","fᵧ=2y, iar fᵧ(2,3)=6."],conceptualQuestion:"Dacă toate derivatele parțiale există într-un punct, funcția este neapărat diferențiabilă acolo? Introdu 1 pentru da, 0 pentru nu.",conceptualAnswer:0,conceptualSolution:["Nu. Existența derivatelor parțiale într-un punct singură nu implică diferențiabilitatea."],reviewQuestion:"Pentru f(x,y)=xy+y², calculează ∂f/∂y în (1,2).",reviewAnswer:5,reviewSolution:["fᵧ=x+2y.","La (1,2), valoarea este 1+4=5."],hint:"La derivarea după y, consideră x constant.",nextStep:"Derivează 3y² și apoi înlocuiește y=2.",solution:["fᵧ(x,y)=6y.","fᵧ(1,2)=6·2=12."],competence:"Derivate parțiale",difficulty:"Introductiv",minutes:20,editorialStatus:"published" },
};

for (const unit of Object.values(studyUnits)) {
  unit.author = "Codex · conținut original inițial";
  unit.sources = ["Material original creat pentru versiunea inițială; necesită verificare editorială."];
  unit.version = 1;
  unit.updatedAt = "2026-10-27";
}
studyUnits[4].prerequisiteIds=["am-03-01"];
studyUnits[6].prerequisiteIds=["am-04-01"];
studyUnits[9].prerequisiteIds=["am-06-01"];
studyUnits[12].prerequisiteIds=["am-03-01"];
studyUnits[16].prerequisiteIds=["am-06-01"];

// Concept checks use meaningful distractors so feedback tests understanding,
// rather than asking students to encode yes/no as an unexplained number.
studyUnits[3].conceptualQuestion="Care formulare exprimă definiția convergenței șirului (aₙ) la L?";
studyUnits[3].conceptualOptions=[
  {id:"epsilon",label:"Pentru orice ε > 0 există N astfel încât n ≥ N implică |aₙ − L| < ε.",correct:true,feedback:"Exact. Orice vecinătate a lui L conține toți termenii de la un anumit rang încolo."},
  {id:"eventually-equal",label:"De la un anumit rang, fiecare termen este egal cu L.",correct:false,feedback:"Asta descrie șiruri eventual constante. Convergența cere apropiere arbitrară, nu egalitate."},
  {id:"some-terms",label:"Există câțiva termeni ai șirului care sunt apropiați de L.",correct:false,feedback:"Câțiva termeni nu ajung: condiția trebuie să țină pentru toți termenii de după rangul N."},
];
studyUnits[4].conceptualQuestion="Ce concluzie este corectă despre limita unei funcții în a?";
studyUnits[4].conceptualOptions=[
  {id:"punct-value",label:"Limita este întotdeauna egală cu f(a).",correct:false,feedback:"Limita depinde de valorile din apropierea lui a; f(a) poate chiar să nu fie definită."},
  {id:"nearby",label:"Limita poate exista chiar dacă f nu este definită în a.",correct:true,feedback:"Corect. Limita descrie comportarea locală pentru x ≠ a, nu valoarea funcției în a."},
  {id:"continuous",label:"Dacă limita există, funcția este automat continuă în a.",correct:false,feedback:"Continuitatea cere suplimentar ca f(a) să fie definită și egală cu limita."},
];
studyUnits[6].conceptualQuestion="Dacă f este diferențiabilă în a, ce relație este garantată?";
studyUnits[6].conceptualOptions=[
  {id:"implies-continuous",label:"f este continuă în a.",correct:true,feedback:"Da. Diferențiabilitatea implică continuitatea în acel punct."},
  {id:"reverse",label:"Orice funcție continuă în a este diferențiabilă în a.",correct:false,feedback:"Implicația inversă nu este valabilă; de exemplu, |x| este continuă în 0, dar nu este diferențiabilă acolo."},
  {id:"derivative-zero",label:"Derivata f′(a) trebuie să fie zero.",correct:false,feedback:"Derivabilitatea garantează existența unei derivate finite, nu că valoarea ei este zero."},
];
studyUnits[9].conceptualQuestion="Pe un interval, cum se deosebesc două primitive ale aceleiași funcții?";
studyUnits[9].conceptualOptions=[
  {id:"constant",label:"Prin adăugarea unei constante reale C.",correct:true,feedback:"Corect. Dacă F′ = f și G′ = f pe un interval, atunci G − F este constantă."},
  {id:"linear",label:"Prin înmulțirea cu o constantă nenulă.",correct:false,feedback:"Înmulțirea schimbă în general derivata. Diferența dintre primitive este constantă."},
  {id:"only-one",label:"Nu există două primitive diferite pe același interval.",correct:false,feedback:"Există o familie de primitive F(x) + C, parametrizată de constanta C."},
];
studyUnits[12].conceptualQuestion="Dacă termenul general aₙ nu tinde la 0, ce știi despre seria Σaₙ?";
studyUnits[12].conceptualOptions=[
  {id:"diverges",label:"Seria diverge, fiindcă termenii sunt necesari să tindă la 0.",correct:true,feedback:"Exact. Este o condiție necesară pentru convergența seriei."},
  {id:"converges",label:"Seria converge dacă termenii alternează ca semn.",correct:false,feedback:"Alternanța singură nu ajunge; dacă aₙ nu tinde la 0, seria diverge."},
  {id:"unknown",label:"Nu se poate trage nicio concluzie despre serie.",correct:false,feedback:"Se poate: testul termenului general garantează divergența când aₙ nu tinde la zero."},
];
studyUnits[16].conceptualQuestion="Într-un punct, existența tuturor derivatelor parțiale garantează diferențiabilitatea?";
studyUnits[16].conceptualOptions=[
  {id:"yes",label:"Da, existența derivatelor parțiale este suficientă.",correct:false,feedback:"Nu întotdeauna. Derivatele parțiale pot exista, iar comportarea pe direcții oblice să împiedice diferențiabilitatea."},
  {id:"no",label:"Nu. Este nevoie de o condiție mai puternică, de exemplu continuitatea derivatelor parțiale într-o vecinătate.",correct:true,feedback:"Corect. Existența derivatelor parțiale doar în punct nu este suficientă."},
  {id:"continuous",label:"Da, dar numai dacă funcția este mărginită.",correct:false,feedback:"Mărginirea nu oferă aproximația liniară necesară diferențiabilității."},
];
studyUnits[3].diagnosticQuestion="Rezolvă inegalitatea |x − 2| < 1. Care este soluția?";
studyUnits[3].diagnosticOptions=[
  {id:"one-three",label:"1 < x < 3",correct:true,feedback:"Corect: |x − 2| < 1 înseamnă că x este la distanță mai mică de 1 față de 2."},
  {id:"outside",label:"x < 1 sau x > 3",correct:false,feedback:"Acest răspuns corespunde inegalității |x − 2| > 1."},
  {id:"all",label:"Toate numerele reale",correct:false,feedback:"Valoarea absolută limitează distanța față de 2; nu sunt admise toate valorile lui x."},
];
studyUnits[4].diagnosticQuestion="Factorizează x² − 4 înainte de a calcula o limită.";
studyUnits[4].diagnosticOptions=[
  {id:"difference-squares",label:"(x − 2)(x + 2)",correct:true,feedback:"Corect. Diferența de pătrate a² − b² se factorizează (a − b)(a + b)."},
  {id:"square-sum",label:"(x − 2)²",correct:false,feedback:"Dezvoltarea dă x² − 4x + 4, nu x² − 4."},
  {id:"linear",label:"x(x − 4)",correct:false,feedback:"Produsul dă x² − 4x. Termenul −4 nu are factor x."},
];
studyUnits[6].diagnosticQuestion="Folosește o factorizare pentru a afla limₓ→₁ (x² − 1)/(x − 1).";
studyUnits[6].diagnosticOptions=[
  {id:"two",label:"2",correct:true,feedback:"Corect. Pentru x ≠ 1, raportul se simplifică la x + 1."},
  {id:"zero",label:"0",correct:false,feedback:"După simplificare rămâne x + 1, care tinde la 2."},
  {id:"undefined",label:"Limita nu există, deoarece expresia nu e definită la x = 1.",correct:false,feedback:"Valoarea funcției în punct nu decide limita; analizăm valorile din apropiere."},
];
studyUnits[9].diagnosticQuestion="Care este derivata funcției f(x) = x²?";
studyUnits[9].diagnosticOptions=[
  {id:"two-x",label:"f′(x) = 2x",correct:true,feedback:"Corect. Regula puterii dă (xⁿ)′ = n·xⁿ⁻¹."},
  {id:"x",label:"f′(x) = x",correct:false,feedback:"Exponentul devine coeficient, iar puterea scade cu unu: 2x."},
  {id:"x-square",label:"f′(x) = x²",correct:false,feedback:"Derivarea schimbă funcția; x² nu este derivata lui x²."},
];
studyUnits[12].diagnosticQuestion="Ce limită are șirul aₙ = 1/n când n crește fără limită?";
studyUnits[12].diagnosticOptions=[
  {id:"zero",label:"0",correct:true,feedback:"Da. Termenii devin oricât de mici când n crește."},
  {id:"one",label:"1",correct:false,feedback:"Primul termen este 1, dar șirul continuă să scadă."},
  {id:"infinity",label:"+∞",correct:false,feedback:"1/n scade spre zero; nu crește fără limită."},
];
studyUnits[16].diagnosticQuestion="Pentru f(x) = x², cât este f′(2)?";
studyUnits[16].diagnosticOptions=[
  {id:"four",label:"4",correct:true,feedback:"Corect. f′(x) = 2x, deci f′(2) = 4."},
  {id:"two",label:"2",correct:false,feedback:"Valoarea funcției este f(2)=4; derivata în punct este tot 4 aici, nu 2."},
  {id:"eight",label:"8",correct:false,feedback:"Aplică regula puterii: derivata lui x² este 2x, apoi evaluează la 2."},
];
// Guided application asks for a mathematical move before the student solves
// the full problem. Distractors explain the underlying misconception.
studyUnits[3].guidedQuestion="Pentru a calcula limita lui (3n + 1)/(n + 2), care este cel mai util prim pas?";
studyUnits[3].guidedOptions=[
  {id:"divide-n",label:"Împart numărătorul și numitorul la n.",correct:true,feedback:"Corect. Raportul devine (3 + 1/n)/(1 + 2/n), iar termenii 1/n și 2/n tind la zero."},
  {id:"substitute-infinity",label:"Înlocuiesc n cu ∞ în expresie.",correct:false,feedback:"∞ nu este un număr care se substituie. Rescrie expresia împărțind la puterea dominantă a lui n."},
  {id:"keep-constant",label:"Păstrez doar termenii constanți 1 și 2.",correct:false,feedback:"Termenii dominanți sunt cei cu n. Împarte toți termenii la n ca să vezi comportarea lor la infinit."},
];
studyUnits[4].guidedQuestion="Pentru limₓ→₂ (x² − 4)/(x − 2), ce transformare permite continuarea?";
studyUnits[4].guidedOptions=[
  {id:"factor",label:"Factorizez x² − 4 = (x − 2)(x + 2), apoi simplific pentru x ≠ 2.",correct:true,feedback:"Da. Limita se calculează din expresia echivalentă x + 2 în vecinătatea lui 2."},
  {id:"substitute",label:"Pun direct x = 2 și concluzionez că limita este 0/0.",correct:false,feedback:"0/0 este o formă nedeterminată, nu valoarea limitei. Simplifică expresia înainte de evaluare."},
  {id:"cancel-terms",label:"Anulez x² cu x și 4 cu 2 separat.",correct:false,feedback:"Termenii unei diferențe nu se anulează separat. Factorizează numărătorul ca diferență de pătrate."},
];
studyUnits[6].guidedQuestion="Pentru f(x) = x³, care este primul pas pentru a afla f′(2)?";
studyUnits[6].guidedOptions=[
  {id:"power-rule",label:"Aplic regula puterii: f′(x) = 3x², apoi evaluez în 2.",correct:true,feedback:"Corect. După derivare, f′(2) = 3 · 2²."},
  {id:"function-value",label:"Calculez f(2) și o consider derivata.",correct:false,feedback:"f(2) este valoarea funcției, nu rata de variație. Aplică regula puterii pentru derivată."},
  {id:"decrease-exponent",label:"Scad exponentul fără să îl folosesc ca factor: f′(x) = x².",correct:false,feedback:"La regula puterii, exponentul devine coeficient și apoi scade cu unu: 3x²."},
];
studyUnits[9].guidedQuestion="Pentru ∫₀² 2x dx, ce alegi înainte să evaluezi integrala?";
studyUnits[9].guidedOptions=[
  {id:"antiderivative",label:"O primitivă F(x) = x² și apoi calculez F(2) − F(0).",correct:true,feedback:"Exact. Teorema fundamentală a analizei dă valoarea 4 − 0."},
  {id:"indefinite-only",label:"Scriu x² + C și mă opresc, fără să folosesc capetele.",correct:false,feedback:"Primitiva este doar pasul intermediar. Integrala definită cere diferența valorilor la capete."},
  {id:"area-rectangle",label:"Consider integrandul constant și înmulțesc 2 cu lungimea intervalului.",correct:false,feedback:"2x variază pe interval. Folosește o primitivă sau interpretează aria sub graficul funcției."},
];
studyUnits[12].guidedQuestion="Pentru seria geometrică Σₙ₌₀∞ (1/2)ⁿ, ce verifici înainte să folosești formula sumei?";
studyUnits[12].guidedOptions=[
  {id:"ratio",label:"Rația q = 1/2 satisface |q| < 1.",correct:true,feedback:"Corect. Condiția garantează convergența, apoi suma este 1/(1 − q)."},
  {id:"terms-positive",label:"Toți termenii sunt pozitivi, deci seria converge.",correct:false,feedback:"Pozitivitatea singură nu garantează convergența. Verifică modulul rației geometrice."},
  {id:"first-term",label:"Primul termen este 1, deci suma este 1.",correct:false,feedback:"Primul termen nu este suma infinită. Pentru |q| < 1 se folosește formula 1/(1 − q)."},
];
studyUnits[16].guidedQuestion="Pentru f(x,y) = x² + 3y², cum calculezi fᵧ(1,2)?";
studyUnits[16].guidedOptions=[
  {id:"hold-x",label:"Păstrez x constant, obțin fᵧ = 6y, apoi evaluez la (1,2).",correct:true,feedback:"Da. Variabila x este constantă la derivarea după y, iar rezultatul este 12."},
  {id:"both-variables",label:"Derivez simultan după x și y și adun rezultatele.",correct:false,feedback:"O derivată parțială se ia față de o singură variabilă; cealaltă rămâne constantă."},
  {id:"x-derivative",label:"Folosesc fₓ = 2x și evaluez la x = 1.",correct:false,feedback:"Asta este derivata parțială după x. Aici se cere derivarea după y."},
];
