"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [inputUrl, setInputUrl]   = useState("");
  const [shortUrl, setShortUrl]   = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [copied, setCopied]       = useState(false);
  const [theme, setTheme]         = useState<"light"|"dark">("light");
  const [lang, setLang]           = useState<"ar"|"en">("ar");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    document.body.className = lang;
  }, [lang]);

  const T = {
    ar: {
      brand: "قصِّر",
      tagline: "الصق أي رابط — احصل على رابط قصير فوراً",
      placeholder: "https://example.com/رابط-طويل-جداً",
      btn: "قصِّر الرابط",
      loading: "جارٍ التقصير...",
      copy: "نسخ",
      copied: "تم النسخ!",
      another: "رابط آخر",
      hint: "اضغط Enter أو انقر الزر",
      open: "فتح",
    },
    en: {
      brand: "Qassir",
      tagline: "Paste any URL — get a short link instantly",
      placeholder: "https://example.com/very/long/url/here",
      btn: "Shorten",
      loading: "Shortening...",
      copy: "Copy",
      copied: "Copied!",
      another: "New URL",
      hint: "Press Enter or click the button",
      open: "Open",
    },
  };
  const t = T[lang];

  async function shorten() {
    if (!inputUrl) return;
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
      setError(lang === "ar" ? "خطأ في الشبكة. حاول مجدداً." : "Network error. Try again.");
    }
    setLoading(false);
  }

  async function copy() {
    await navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function reset() {
    setShortUrl(""); setError(""); setInputUrl("");
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap');
        :root {
          --bg:#ffffff; --bg2:#f7f6f3; --bg3:#efeeea;
          --border:#e9e8e3; --border2:#d4d3cc;
          --text:#1a1a1a; --text2:#6b6b6b; --text3:#9b9b9b;
          --green:#16a34a; --green-bg:#dcfce7;
          --red:#dc2626;   --red-bg:#fee2e2;
          --shadow-md:0 4px 12px rgba(0,0,0,0.07);
          --radius:8px;
          --font-ar:'IBM Plex Sans Arabic',sans-serif;
          --font-en:'Inter',sans-serif;
        }
        [data-theme="dark"] {
          --bg:#191919; --bg2:#212121; --bg3:#2a2a2a;
          --border:#333333; --border2:#444444;
          --text:#e8e8e8; --text2:#999999; --text3:#666666;
          --shadow-md:0 4px 12px rgba(0,0,0,0.25);
        }
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        html,body{height:100%;}
        body{background:var(--bg2);color:var(--text);transition:background 0.25s,color 0.25s;}
        body.ar{font-family:var(--font-ar);direction:rtl;}
        body.en{font-family:var(--font-en);direction:ltr;}
        .shell{display:flex;flex-direction:column;min-height:100vh;}
        .topbar{
          height:52px;background:var(--bg);border-bottom:1px solid var(--border);
          padding:0 28px;display:flex;align-items:center;justify-content:space-between;
          position:sticky;top:0;z-index:10;transition:background 0.25s,border-color 0.25s;
        }
        .brand-wrap{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:600;color:var(--text);letter-spacing:-0.2px;text-decoration:none;}
        .brand-icon{width:22px;height:22px;border-radius:6px;background:var(--text);display:flex;align-items:center;justify-content:center;transition:background 0.25s;}
        .brand-icon svg{stroke:var(--bg);fill:none;width:12px;height:12px;}
        .topbar-actions{display:flex;align-items:center;gap:6px;}
        .tb-btn{
          font-size:12px;font-weight:500;padding:5px 12px;height:30px;
          border:1px solid var(--border);background:var(--bg);color:var(--text2);
          border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;
          transition:all 0.15s;white-space:nowrap;font-family:inherit;
        }
        .tb-btn:hover{background:var(--bg3);color:var(--text);border-color:var(--border2);}
        .divider-v{width:1px;height:18px;background:var(--border);margin:0 2px;}
        .main-content{flex:1;display:flex;align-items:center;justify-content:center;padding:40px 20px;}
        .card{
          background:var(--bg);border:1px solid var(--border);border-radius:12px;
          padding:40px 36px;width:100%;max-width:540px;
          box-shadow:var(--shadow-md);transition:background 0.25s,border-color 0.25s;
        }
        .tagline{font-size:13px;color:var(--text3);margin-bottom:28px;line-height:1.6;}
        .input-row{display:flex;gap:8px;margin-bottom:6px;}
        .url-input{
          flex:1;background:var(--bg2);border:1px solid var(--border);
          border-radius:var(--radius);padding:10px 14px;color:var(--text);
          font-size:14px;outline:none;font-family:inherit;
          transition:border-color 0.15s,background 0.15s;
        }
        .url-input::placeholder{color:var(--text3);}
        .url-input:focus{border-color:var(--border2);background:var(--bg);}
        .shorten-btn{
          background:var(--text);color:var(--bg);border:none;border-radius:var(--radius);
          padding:10px 20px;font-weight:600;cursor:pointer;font-size:13px;
          font-family:inherit;white-space:nowrap;transition:opacity 0.15s;
        }
        .shorten-btn:hover:not(:disabled){opacity:0.85;}
        .shorten-btn:disabled{opacity:0.4;cursor:not-allowed;}
        .hint{font-size:11px;color:var(--text3);}
        .error-box{background:var(--red-bg);border:1px solid #fca5a5;border-radius:var(--radius);padding:10px 14px;font-size:13px;color:var(--red);margin-top:16px;}
        .result-box{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:14px 16px;margin-top:20px;transition:background 0.25s,border-color 0.25s;}
        .result-label{font-size:11px;font-weight:600;color:var(--text3);text-transform:uppercase;letter-spacing:0.7px;margin-bottom:10px;}
        .result-url{font-size:14px;font-weight:500;color:var(--green);word-break:break-all;text-decoration:none;display:block;margin-bottom:12px;}
        .result-url:hover{text-decoration:underline;}
        .result-actions{display:flex;gap:8px;flex-wrap:wrap;}
        .copy-btn{
          font-size:12px;font-weight:500;padding:5px 14px;height:30px;
          border:1px solid var(--border);background:var(--bg);color:var(--text2);
          border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;gap:5px;
          transition:all 0.15s;font-family:inherit;text-decoration:none;
        }
        .copy-btn:hover{background:var(--bg3);color:var(--text);border-color:var(--border2);}
        .copy-btn.success{background:var(--green-bg);color:var(--green);border-color:#86efac;}
        .another-btn{
          font-size:12px;font-weight:500;padding:5px 14px;height:30px;
          border:1px solid var(--border);background:transparent;color:var(--text3);
          border-radius:6px;cursor:pointer;display:inline-flex;align-items:center;
          transition:all 0.15s;font-family:inherit;
        }
        .another-btn:hover{background:var(--bg3);color:var(--text);border-color:var(--border2);}
        .footer{text-align:center;padding:20px;font-size:11px;color:var(--text3);border-top:1px solid var(--border);}
        @media(max-width:520px){
          .card{padding:28px 20px;}
          .input-row{flex-direction:column;}
          .shorten-btn{width:100%;}
        }
      `}</style>

      <div className="shell">
        <header className="topbar">
          <a className="brand-wrap" href="/">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
              </svg>
            </div>
            {t.brand}
          </a>
          <div className="topbar-actions">
            <button className="tb-btn" onClick={() => setLang(l => l === "ar" ? "en" : "ar")}>
              {lang === "ar" ? "EN" : "ع"}
            </button>
            <div className="divider-v"/>
            <button
              className="tb-btn"
              onClick={() => setTheme(th => th === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              )}
            </button>
          </div>
        </header>

        <div className="main-content">
          <div className="card">
            <p className="tagline">{t.tagline}</p>

            <div className="input-row">
              <input
                className="url-input"
                type="url"
                placeholder={t.placeholder}
                value={inputUrl}
                onChange={e => setInputUrl(e.target.value)}
                onKeyDown={e => e.key === "Enter" && shorten()}
              />
              <button
                className="shorten-btn"
                onClick={shorten}
                disabled={loading || !inputUrl}
              >
                {loading ? t.loading : t.btn}
              </button>
            </div>

            <p className="hint">{t.hint}</p>

            {error && <div className="error-box">{error}</div>}

            {shortUrl && (
              <div className="result-box">
                <div className="result-label">
                  {lang === "ar" ? "رابطك المختصر" : "Your short link"}
                </div>
                <a className="result-url" href={shortUrl} target="_blank" rel="noopener noreferrer">
                  {shortUrl}
                </a>
                <div className="result-actions">
                  <button className={`copy-btn${copied ? " success" : ""}`} onClick={copy}>
                    {copied ? t.copied : t.copy}
                  </button>
                  <a className="copy-btn" href={shortUrl} target="_blank" rel="noopener noreferrer">
                    {t.open}
                  </a>
                  <button className="another-btn" onClick={reset}>
                    {t.another}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="footer">
          {lang === "ar"
            ? "مجاني بالكامل · بدون تسجيل · روابط دائمة"
            : "Free · No signup · Permanent links"}
        </footer>
      </div>
    </>
  );
}
