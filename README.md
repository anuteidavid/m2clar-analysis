# m2clar — Analiză matematică universitară

Aplicație în limba română pentru studiu gradual la Analiză matematică. Stack: Next.js 15, React 19, TypeScript, KaTeX și Supabase Auth/Postgres. Lecțiile reprezentative sunt date tipizate în `data/analysis-curriculum.ts`; înregistrările de conținut și progresul cu autentificare folosesc schema Supabase. Progresul fără cont se păstrează local în browser.

## Pornire locală

1. Folosește Node.js 20+ și rulează `npm install`.
2. Copiază `.env.example` în `.env.local`. Pentru autentificare/progres sincronizat completează `NEXT_PUBLIC_SUPABASE_URL` și `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Fără Supabase, lecțiile reprezentative funcționează și salvează local.
3. Pornește `npm run dev`, apoi deschide `http://localhost:3000`.
4. Pentru persistență în cloud, rulează `supabase/schema.sql`, apoi `supabase/analysis-schema.sql` și `supabase/analysis-seed.sql` în Supabase SQL Editor, în această ordine.
5. Verificarea simbolică pentru expresii este opțională: creează un mediu Python, instalează `checker/requirements.txt` și pornește `uvicorn main:app --reload --app-dir checker --host 127.0.0.1 --port 8001`. Setează `NEXT_PUBLIC_CHECKER_URL` numai dacă ai unități cu `answerMode: "expression"`.

## Conținut disponibil

Cele 20 de module și cele șase extensii opționale sunt în `data/analysis-curriculum.ts`. Sunt publicate șase lecții reprezentative: șiruri (3), limite (4), derivate (6), integrale (9), serii (12) și derivate parțiale (16). Fiecare are flux cu opt etape, prerechizite, definiție, exemplu, activitate ghidată, exercițiu independent distinct, verificare conceptuală, problemă de recapitulare nouă, indicii, soluții și competență. Starea „consolidată” cere răspunsuri corecte fără ajutor la aplicarea independentă, verificarea conceptuală și recapitularea ulterioară. Celelalte module au structură și așteaptă itemii numerotați ai programei detaliate; nu sunt prezentate ca lecții complete.

## Adăugarea unei lecții fără schimbarea interfeței

Pentru lecții livrate împreună cu aplicația, adaugă un obiect `StudyUnit` în `studyUnits` din `data/analysis-curriculum.ts`, cu ID stabil și cheia numerică a modulului. Pagina modulului atașează automat componenta generică de studiu. Pentru conținut editorial gestionat în baza de date, autentifică-te cu un utilizator înscris în `analysis_content_admins`, deschide `/admin`, creează unitatea și editează obiectul JSON. Salvarea creează o versiune nouă; statutul poate fi ciornă, în verificare, publicat sau arhivat. Importul/exportul se face prin fișier JSON în editor.

Structura minimă a conținutului administrat: `title`, `objectives`, `competencies`, `prerequisites`, `intuition`, `definition`, `example`, `question`, `answer`, `tolerance`, `hint`, `nextStep`, `solution`, `difficulty`, `minutes`, `sources`, `author`, `version`, `updated_at`. Lecțiile pot include separat `independentQuestion`/`independentAnswer`, `conceptualQuestion`/`conceptualAnswer` și `reviewQuestion`/`reviewAnswer`. `analysis_unit_versions` păstrează istoricul, iar încercările fac referire la versiunea folosită.

## Administrare și permisiuni

Zona `/admin` verifică rolul `analysis_content_admins`; RLS aplică aceeași autorizare în Postgres, inclusiv pentru scriere. După crearea contului administratorului, adaugă UUID-ul lui în tabel folosind SQL Editor cu privilegii de service role. Nu expune cheia service role în client. Studenții pot citi doar conținut publicat și își pot citi/scrie numai propriile încercări și progres.

Schema universitară adaugă tabele noi și nu șterge date existente. Pe proiecte Supabase care au folosit schema veche, tabelele istorice pot exista în baza de date, dar aplicația nu le mai citește. Nu rula operații DROP pentru curățarea lor fără o decizie separată privind retenția datelor.

## Verificare

Rulează `npm run build` și `python -m unittest discover -s checker -v`. Lecțiile inițiale folosesc răspunsuri numerice; editorul și verificatorul existent pot lucra cu expresii în formatul restrâns `x`, `+`, `-`, `*`, `/`, `^`, `sin`, `cos`, `tan`, `exp`, `log`, `sqrt`, `pi`, `E` și `I`. Verificatorul folosește simplificare simbolică; un rezultat neconfirmat nu este declarat matematic greșit. Nu există încă verificare completă a domeniilor, evaluare robustă a demonstrațiilor, toate tipurile de activități cerute sau încărcare de fișiere. Configurarea programelor și extensiilor se salvează local, nu între dispozitive.
