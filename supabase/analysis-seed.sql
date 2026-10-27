-- Initial university curriculum headings and representative lessons.
insert into public.analysis_modules(id,title,position,editorial_status) values
(0,'Limbaj matematic și raționament',0,'published'),(1,'Calcul algebric și funcții elementare',1,'published'),
(2,'Numere reale și structura dreptei reale',2,'published'),(3,'Șiruri numerice',3,'published'),
(4,'Limite de funcții',4,'published'),(5,'Continuitate',5,'published'),(6,'Derivare și diferențiabilitate',6,'published'),
(7,'Teoreme de calcul diferențial și aplicații',7,'published'),(8,'Formula Taylor și aproximări locale',8,'published'),
(9,'Primitive și metode de integrare',9,'published'),(10,'Integrala definită',10,'published'),(11,'Integrale improprii',11,'published'),
(12,'Serii numerice',12,'published'),(13,'Șiruri și serii de funcții',13,'published'),(14,'Serii de puteri și serii Taylor',14,'published'),
(15,'Spațiul Rⁿ, limite și continuitate',15,'published'),(16,'Calcul diferențial în mai multe variabile',16,'published'),
(17,'Extreme și optimizare',17,'published'),(18,'Integrale duble și triple',18,'published'),
(19,'Integrale curbilinii, de suprafață și calcul vectorial',19,'published')
on conflict(id) do nothing;

insert into public.analysis_units(id,module_id,title,position,difficulty,estimated_minutes,editorial_status,current_version,published_version) values
('am-03-01',3,'Convergența unui șir',1,'introductory',18,'published',1,1),
('am-04-01',4,'Limite și forme nedeterminate',1,'introductory',20,'published',1,1),
('am-06-01',6,'Derivata ca rată de variație',1,'introductory',16,'published',1,1),
('am-09-01',9,'Primitive și constanta de integrare',1,'introductory',18,'published',1,1),
('am-12-01',12,'Convergența seriilor numerice',1,'introductory',22,'published',1,1),
('am-16-01',16,'Derivate parțiale și gradient',1,'introductory',20,'published',1,1)
on conflict(id) do nothing;

insert into public.analysis_unit_versions(unit_id,version,content,source) values
('am-03-01',1,'{"title":"Convergența unui șir","objectives":["Folosirea definiției convergenței","Estimarea limitei unui șir"],"prerequisites":["Modulul 2: valoare absolută și inegalități"],"intuition":"Termenii șirului 1/n se apropie de 0.","definition":"Șirul (aₙ) converge la L dacă pentru orice ε>0 există N astfel încât n≥N implică |aₙ−L|<ε.","example":"Pentru aₙ=1/n, alegem N>1/ε; rezultă limita 0.","question":"Determină limita șirului (3n+1)/(n+2).","answer":3,"tolerance":0.00000001,"hint":"Împarte numărătorul și numitorul la n.","nextStep":"Compară coeficienții termenilor de grad maxim.","solution":["Scriem (3+1/n)/(1+2/n).","1/n tinde la 0.","Limita este 3."],"competence":"Calculul limitelor de șiruri","difficulty":"Introductiv","minutes":18}'::jsonb,'Conținut inițial original'),
('am-04-01',1,'{"title":"Limite și forme nedeterminate","objectives":["Identificarea formei 0/0"],"prerequisites":["Factoring polynomials","Limite de șiruri"],"intuition":"O funcție poate să nu fie definită într-un punct, deși limita există.","definition":"Limita f(x) la a este L dacă valorile f(x) devin arbitrar de apropiate de L când x se apropie de a, x≠a.","example":"(x²−1)/(x−1)=x+1 pentru x≠1; limita la 1 este 2.","question":"Calculează limita la x→2 pentru (x²−4)/(x−2).","answer":4,"tolerance":0.00000001,"hint":"Numărătorul este o diferență de pătrate.","nextStep":"Simplifică factorul x−2 pentru x diferit de 2.","solution":["x²−4=(x−2)(x+2).","Raportul se reduce la x+2.","Limita este 4."],"competence":"Transformarea formelor nedeterminate","difficulty":"Introductiv","minutes":20}'::jsonb,'Conținut inițial original'),
('am-06-01',1,'{"title":"Derivata ca rată de variație","objectives":["Interpretarea derivatei","Aplicarea regulilor de derivare"],"prerequisites":["Limite de funcții"],"intuition":"Panta secantei tinde spre panta tangentei când punctele se apropie.","definition":"f′(a)=lim h→0 (f(a+h)−f(a))/h, dacă limita există și este finită.","example":"Pentru f(x)=x², raportul incremental devine 2x+h; derivata este 2x.","question":"Pentru f(x)=x³, determină f′(2).","answer":12,"tolerance":0.00000001,"hint":"Aplică regula puterii.","nextStep":"Derivează  x³ și evaluează la 2.","solution":["f′(x)=3x².","f′(2)=12."],"competence":"Calculul derivatelor","difficulty":"Introductiv","minutes":16}'::jsonb,'Conținut inițial original'),
('am-09-01',1,'{"title":"Primitive și constanta de integrare","objectives":["Recunoașterea unei primitive","Folosirea constantei de integrare"],"prerequisites":["Reguli de derivare"],"intuition":"Integrarea nedefinită inversează derivarea.","definition":"F este o primitivă a lui f dacă F′=f; toate primitivele pe un interval sunt F+C.","example":"Primitivele lui x² sunt x³/3+C.","question":"Calculează integrala definită de la 0 la 2 pentru 2x.","answer":4,"tolerance":0.00000001,"hint":"O primitivă a lui 2x este x².","nextStep":"Evaluează primitiva la capete și scade.","solution":["F(x)=x².","F(2)−F(0)=4."],"competence":"Calculul integralelor elementare","difficulty":"Introductiv","minutes":18}'::jsonb,'Conținut inițial original'),
('am-12-01',1,'{"title":"Convergența seriilor numerice","objectives":["Legătura dintre serie și șirul sumelor parțiale","Aplicarea criteriului geometric"],"prerequisites":["Limite de șiruri"],"intuition":"O serie converge dacă șirul sumelor parțiale are limită finită.","definition":"Σaₙ converge dacă sₙ=Σₖ₌₁ⁿaₖ are limită finită.","example":"Pentru |q|<1, Σₙ₌₀∞qⁿ=1/(1−q).","question":"Calculează suma seriei geometrice Σₙ₌₀∞(1/2)ⁿ.","answer":2,"tolerance":0.00000001,"hint":"Primul termen este 1 și rația 1/2.","nextStep":"Folosește formula a/(1−q), pentru |q|<1.","solution":["|1/2|<1, deci seria converge.","S=1/(1−1/2)=2."],"competence":"Criterii de convergență și sume","difficulty":"Introductiv","minutes":22}'::jsonb,'Conținut inițial original'),
('am-16-01',1,'{"title":"Derivate parțiale și gradient","objectives":["Calcularea derivatelor parțiale","Interpretarea gradientului"],"prerequisites":["Reguli de derivare","Funcții de mai multe variabile"],"intuition":"Pentru variația pe o direcție coordonată, păstrăm cealaltă variabilă fixă.","definition":"∂f/∂y(a,b)=lim h→0 [f(a,b+h)−f(a,b)]/h; gradientul este vectorul derivatelor parțiale.","example":"Pentru f=x²+xy, fₓ=2x+y și fᵧ=x.","question":"Pentru f(x,y)=x²+3y², determină fᵧ(1,2).","answer":12,"tolerance":0.00000001,"hint":"La derivarea după y, consideră x constant.","nextStep":"Derivează 3y² și înlocuiește y=2.","solution":["fᵧ=6y.","fᵧ(1,2)=12."],"competence":"Derivate parțiale","difficulty":"Introductiv","minutes":20}'::jsonb,'Conținut inițial original')
on conflict(unit_id,version) do nothing;

update public.analysis_unit_versions set editorial_status='published'
where unit_id in ('am-03-01','am-04-01','am-06-01','am-09-01','am-12-01','am-16-01') and version=1;

insert into public.analysis_competencies(id,title) values
('seq-limit','Calculul limitelor de șiruri'),('function-limits','Transformarea formelor nedeterminate'),
('differentiate','Calculul derivatelor'),('integration','Calculul integralelor elementare'),
('series','Criterii de convergență și sume'),('partial-derivatives','Derivate parțiale') on conflict(id) do nothing;
insert into public.analysis_unit_competencies(unit_id,competency_id) values
('am-03-01','seq-limit'),('am-04-01','function-limits'),('am-06-01','differentiate'),
('am-09-01','integration'),('am-12-01','series'),('am-16-01','partial-derivatives') on conflict do nothing;
insert into public.analysis_unit_prerequisites(unit_id,prerequisite_unit_id) values
('am-04-01','am-03-01'),('am-06-01','am-04-01'),('am-09-01','am-06-01'),('am-12-01','am-03-01'),('am-16-01','am-06-01') on conflict do nothing;
