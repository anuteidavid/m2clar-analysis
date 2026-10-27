"use client";
import { useState } from "react";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export default function Page() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [notice, setNotice] = useState("");

  function prepareEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!contactEmail) {
      setNotice("Adresa de contact nu este configurată încă. Adaugă NEXT_PUBLIC_CONTACT_EMAIL în .env.local.");
      return;
    }
    const subject = encodeURIComponent(`Mesaj de la ${name} — m2clar`);
    const body = encodeURIComponent(`${message}\n\nRăspuns către: ${email}`);
    window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
    setNotice("Am pregătit mesajul în aplicația ta de e-mail. Verifică-l și trimite-l de acolo.");
  }

  return <main className="wrap" style={{ paddingTop: 55, minHeight: "60vh" }}>
    <span className="pill">Contact</span>
    <h1 className="serif" style={{ fontSize: 50 }}>Hai să <em>vorbim.</em></h1>
    <div className="card" style={{ maxWidth: 600, marginTop: 24 }}>
      <h2 className="serif" style={{ fontSize: 26, marginTop: 0 }}>Scrie-ne</h2>
      <p className="muted" style={{ lineHeight: 1.7 }}>Completează mesajul; se va deschide aplicația ta de e-mail pentru trimitere.</p>
      {!contactEmail && <p className="muted">[DE COMPLETAT: adresa de contact în variabila NEXT_PUBLIC_CONTACT_EMAIL]</p>}
      <form onSubmit={prepareEmail} style={{ display: "grid", gap: 14 }}>
        <label>Numele tău<input required value={name} onChange={e => setName(e.target.value)} /></label>
        <label>E-mailul tău<input required type="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label>Mesaj<textarea required rows={5} value={message} onChange={e => setMessage(e.target.value)} /></label>
        <button className="btn" type="submit">Pregătește mesajul</button>
      </form>
      {notice && <p role="status" className="muted" style={{ marginTop: 16 }}>{notice}</p>}
    </div>
    <style>{`.card label{display:grid;gap:7px;font-size:14px;font-weight:700}.card input,.card textarea{padding:12px;border:1px solid #dbe2ed;border-radius:10px;font:inherit}`}</style>
  </main>;
}
