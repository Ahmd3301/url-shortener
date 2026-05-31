"use client";
import { useState } from "react";

export default function Home() {
  const [inputUrl, setInputUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [copied, setCopied]     = useState(false);

  async function shorten() {
    setError(""); setShortUrl(""); setLoading(true);
    try {
      const res  = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: inputUrl }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error);
      else setShortUrl(data.shortUrl);
    } catch {
      setError("Network error. Try again.");
    }
    setLoading(false);
  }

  async function copy() {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>URL Shortener</h1>
        <p style={s.sub}>Paste any link. Get a short one.</p>

        <div style={s.row}>
          <input
            style={s.input}
            type="url"
            placeholder="https://example.com/very/long/url"
            value={inputUrl}
            onChange={e => setInputUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && shorten()}
          />
          <button style={s.btn} onClick={shorten} disabled={loading || !inputUrl}>
            {loading ? "..." : "Shorten"}
          </button>
        </div>

        {error && <p style={s.error}>{error}</p>}

        {shortUrl && (
          <div style={s.result}>
            <a href={shortUrl} target="_blank" style={s.link}>{shortUrl}</a>
            <button style={s.copyBtn} onClick={copy}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

const s: Record<string, React.CSSProperties> = {
  page:    { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0f0f0f", fontFamily:"monospace" },
  card:    { background:"#1a1a1a", border:"1px solid #2a2a2a", borderRadius:12, padding:"40px 32px", width:"100%", maxWidth:520 },
  title:   { color:"#fff", fontSize:28, fontWeight:700, margin:"0 0 6px" },
  sub:     { color:"#666", fontSize:14, margin:"0 0 28px" },
  row:     { display:"flex", gap:8 },
  input:   { flex:1, background:"#111", border:"1px solid #333", borderRadius:8, padding:"10px 14px", color:"#fff", fontSize:14, outline:"none" },
  btn:     { background:"#fff", color:"#000", border:"none", borderRadius:8, padding:"10px 20px", fontWeight:700, cursor:"pointer", fontSize:14 },
  error:   { color:"#ff4444", fontSize:13, marginTop:12 },
  result:  { marginTop:20, background:"#111", border:"1px solid #2a2a2a", borderRadius:8, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 },
  link:    { color:"#4ade80", fontSize:14, textDecoration:"none", wordBreak:"break-all" },
  copyBtn: { background:"#2a2a2a", color:"#fff", border:"none", borderRadius:6, padding:"6px 14px", cursor:"pointer", fontSize:13, whiteSpace:"nowrap" },
};
