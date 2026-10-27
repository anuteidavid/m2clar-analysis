import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = { title: "m2clar — Analiză matematică universitară", description: "Lecții, exerciții și progres pentru Analiză matematică universitară." };
const links = [["Programa","/analiza"],["Recapitulare","/plan"],["Evaluare","/examen"],["Progres","/dashboard"],["Despre","/despre"]];
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="ro"><body><header className="site-header"><div className="wrap header-inner"><Link href="/" className="brand" aria-label="m2clar, pagina principală">m2<span className="brand-mark">clar.</span></Link><nav className="navlinks" aria-label="Navigare principală">{links.map(([label,url])=><Link key={url} href={url}>{label}</Link>)}</nav><details className="mobile-menu"><summary aria-label="Deschide meniul">Meniu</summary><nav className="mobile-links" aria-label="Navigare mobilă">{links.map(([label,url])=><Link key={url} href={url}>{label}</Link>)}</nav></details><Link className="btn account-link" href="/cont">Contul meu <span aria-hidden>↗</span></Link></div></header>{children}<footer className="site-footer"><div className="wrap site-footer-inner"><span>© 2026 m2clar · Analiză matematică</span><div className="footer-links"><Link href="/despre">Despre</Link><Link href="/contact">Contact</Link><Link href="/analiza">Programa</Link><Link href="/admin">Administrare</Link></div></div></footer></body></html>
}
