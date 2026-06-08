"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import styles from "./DirectoryClient.module.css";
import Logo from "./Logo";

interface Provider {
  id: string;
  name: string;
  logoUrl?: string;
  modelCount: number;
  type?: string;
  freeSummary?: string;
  notes?: string;
  maxContext?: string;
  capabilities: string[];
}

export default function DirectoryClient({ providers, dict, lang, lastUpdatedAt }: { providers: Provider[], dict: any, lang: string, lastUpdatedAt?: string }) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortMode, setSortMode] = useState<string>("popular");
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filters = ["all", "text", "vision", "image", "audio", "video", "code", "embeddings", "reranking"];

  const parseContext = (ctx?: string) => {
    if (!ctx) return 0;
    const clean = ctx.toUpperCase().replace(/[^0-9.KMB]/g, '');
    let multiplier = 1;
    if (clean.includes('K')) multiplier = 1000;
    if (clean.includes('M')) multiplier = 1000000;
    if (clean.includes('B')) multiplier = 1000000000;
    const num = parseFloat(clean.replace(/[KMB]/g, ''));
    return isNaN(num) ? 0 : num * multiplier;
  };

  const filteredProviders = providers.filter((p) => {
    const matchesFilter = activeFilter === "all" || p.capabilities.includes(activeFilter);
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.notes && p.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    if (sortMode === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortMode === "models") {
      return b.modelCount - a.modelCount;
    } else if (sortMode === "max_context") {
      return parseContext(b.maxContext) - parseContext(a.maxContext);
    }
    // "popular" is default, we assume it's the original JSON order or we can just keep it as is
    return 0; 
  });

  return (
    <>
      <header className={styles.header}>
        <nav className={`${styles.nav} glass-nav`}>
          <a href="/" className={styles.logo}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="url(#logo-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <defs>
                <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
              <rect x="9" y="9" width="6" height="6"></rect>
              <line x1="9" y1="1" x2="9" y2="4"></line>
              <line x1="15" y1="1" x2="15" y2="4"></line>
              <line x1="9" y1="20" x2="9" y2="23"></line>
              <line x1="15" y1="20" x2="15" y2="23"></line>
              <line x1="20" y1="9" x2="23" y2="9"></line>
              <line x1="20" y1="14" x2="23" y2="14"></line>
              <line x1="1" y1="9" x2="4" y2="9"></line>
              <line x1="1" y1="14" x2="4" y2="14"></line>
            </svg>
            <span style={{ letterSpacing: "-0.5px" }}>
              <span style={{ color: "var(--color-fog)" }}>Token</span>
              <span style={{ color: "#0ea5e9" }}>AI</span>
              <span style={{ 
                background: "linear-gradient(to right, #0ea5e9, #a855f7)", 
                WebkitBackgroundClip: "text", 
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent"
              }}>Free</span>
            </span>
          </a>
          <div className={styles.navLinks}>
            <a href="#direktori">{dict.nav.directory}</a>
            <a href="#cara-kerja">{dict.nav.how_it_works}</a>
            <a href="#sumber">{dict.nav.source}</a>
          </div>
          
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <Link href={`/${lang}/donate`} className="btn-donate">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"/>
                <path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/>
                <path d="m2 15 6 6"/>
                <path d="M19.5 8.5 18 7l1.5-1.5a2.12 2.12 0 1 0-3-3l-1.5 1.5-1.5-1.5a2.12 2.12 0 1 0-3 3l1.5 1.5"/>
              </svg>
              <span>Donate</span>
            </Link>
            <div className={styles.langSwitcher}>
              <a href={lang === 'en' ? '/id' : '/en'} style={{ fontSize: "14px", fontWeight: "600", color: "var(--color-fog)", padding: "4px 8px", backgroundColor: "var(--color-glass-active)", borderRadius: "4px" }}>
                {lang === 'en' ? 'ID' : 'EN'}
              </a>
            </div>
            {mounted && (
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className={styles.themeToggle}
                aria-label="Toggle Theme"
              >
                {resolvedTheme === "dark" ? `☀️ ${dict.nav.theme_light}` : `🌙 ${dict.nav.theme_dark}`}
              </button>
            )}
            <a href="#direktori" className="btn-primary" style={{ padding: "6px 12px", fontSize: "13px" }}>
              {dict.directory.view_btn}
            </a>
          </div>
        </nav>
      </header>

      <main className="container">
        <section className={styles.hero}>
          <h1 className={styles.title}>{dict.hero.title}</h1>
          <p className={styles.subtitle}>
            {dict.hero.subtitle}
          </p>
          <div style={{ marginBottom: "24px" }}>
            <span className="badge-success">
              ✅ {providers.length} providers · {dict.hero.badge_models}
            </span>
            {lastUpdatedAt && (
              <span style={{ fontSize: "12px", color: "var(--color-mute)", marginLeft: "12px" }}>
                Terakhir disinkronisasi: {new Date(lastUpdatedAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
              </span>
            )}
          </div>
          <a href="#direktori" className="btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
            {dict.hero.cta}
          </a>
        </section>

        <div className={styles.dashboardLayout}>
          {/* LEFT SIDEBAR */}
          <aside className={styles.sidebar}>
            <div className={styles.sidebarBlock}>
              <h3 className={styles.sidebarTitle}>{dict.directory.search_placeholder.split(" ")[0] || "Filter"}</h3>
              <div className={styles.filterList}>
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`${styles.filterBtn} ${activeFilter === f ? styles.filterBtnActive : ""}`}
                  >
                    {f === "all" ? dict.directory.filter_all : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div id="cara-kerja" className={styles.sidebarBlock} style={{ marginTop: "32px" }}>
              <h3 className={styles.sidebarTitle}>{dict.directory.how_it_works_title}</h3>
              <p className={styles.sourceText} style={{ fontSize: "13px" }}>
                {dict.directory.how_it_works_desc}
              </p>
            </div>

            <div id="sumber" className={styles.sidebarBlock} style={{ marginTop: "32px" }}>
              <h3 className={styles.sidebarTitle}>{dict.directory.source_title}</h3>
              <p className={styles.sourceText} style={{ fontSize: "13px" }}>
                {dict.directory.source_desc} <a href="https://freellm.net" target="_blank" rel="noreferrer" className={styles.sourceLink}>freellm.net</a>, <a href="https://github.com/mnfst/awesome-free-llm-apis" target="_blank" rel="noreferrer" className={styles.sourceLink}>mnfst</a>, dan <a href="https://github.com/cheahjs/free-llm-api-resources" target="_blank" rel="noreferrer" className={styles.sourceLink}>cheahjs</a>.
              </p>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <section id="direktori" className={styles.mainContent}>
            <div className={styles.controlsTop}>
              <input 
                type="text" 
                className="input-search" 
                placeholder={dict.directory.search_placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <select 
                className="input-search" 
                style={{ width: "200px" }}
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value)}
              >
                <option value="popular">{dict.directory.sort_popular}</option>
                <option value="max_context">{dict.directory.sort_context || "Context Terbesar"}</option>
                <option value="name">{dict.directory.sort_name}</option>
                <option value="models">{dict.directory.sort_models}</option>
              </select>
            </div>

            <div className={styles.grid}>
              <div className={styles.tableHeader}>
                <span>{dict.directory.table_provider || "Provider"}</span>
                <span>{dict.directory.table_capabilities || "Capabilities"}</span>
                <span>{dict.directory.table_ratelimit || "Rate Limit"}</span>
                <span>{dict.directory.table_notes || "Notes"}</span>
                <span style={{ textAlign: "right" }}>{dict.directory.table_action || "Action"}</span>
              </div>
              {filteredProviders.map((provider) => (
                <a key={provider.id} href={`/${lang}/provider/${provider.id}`} className={styles.providerRow + " card"}>
                  <div className={styles.providerHeader}>
                    <div className={styles.providerLogo}>
                      {provider.logoUrl ? (
                        <>
                          <img 
                            src={provider.logoUrl} 
                            alt={provider.name} 
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              if (e.currentTarget.nextElementSibling) {
                                (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                              }
                            }}
                          />
                          <span style={{ display: 'none' }}>{provider.name.charAt(0)}</span>
                        </>
                      ) : (
                        <span>{provider.name.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <span className={styles.providerName}>{provider.name}</span>
                      <div className={styles.providerMeta}>
                        <span className={styles.modelsCount}>{provider.modelCount} {dict.directory.models}</span>
                        {provider.type && <span className={styles.providerType}>{provider.type}</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.modalityIcons}>
                    {provider.capabilities.map((m) => {
                      // Mapping to exact same icons as ProviderDetailClient
                      const getIcon = (mod: string) => {
                        switch(mod.toLowerCase()) {
                          case "text": return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/></svg>;
                          case "vision":
                          case "image": return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
                          case "audio": return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>;
                          case "video": return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/><path d="M2 14h20"/><path d="M7 5v4"/><path d="M17 5v4"/><path d="M7 15v4"/><path d="M17 15v4"/></svg>;
                          case "code": return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
                          case "embeddings": return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>;
                          case "reranking": return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" x2="12" y1="5" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>;
                          default: return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>;
                        }
                      };
                      return (
                        <span key={m} className={styles.modalityIcon} title={m}>
                          {getIcon(m)}
                        </span>
                      );
                    })}
                  </div>
                  
                  <div className={styles.rateLimit}>{provider.freeSummary || dict.directory.unknown}</div>
                  
                  <div className={styles.description}>
                    {provider.notes || dict.directory.no_desc}
                  </div>
                  
                  <div className={styles.actions}>
                    <span className="btn-primary" style={{ fontSize: "12px", padding: "6px 12px", width: "100%", textAlign: "center" }}>{dict.directory.view_btn}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className={styles.footer} style={{ marginTop: "80px", padding: "40px 16px", borderTop: "1px solid var(--color-ink-line)", textAlign: "center", color: "var(--color-mute)", fontSize: "14px" }}>
        <div className="container">
          <p>© {new Date().getFullYear()} TokenAIFree. {dict.footer.text}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "16px" }}>
            <a href="https://github.com" target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>GitHub</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>Twitter</a>
            <a href="https://discord.com" target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>Discord</a>
          </div>
        </div>
      </footer>
    </>
  );
}
