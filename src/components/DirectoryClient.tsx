"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import styles from "./DirectoryClient.module.css";
import Logo from "./Logo";

interface Provider {
  id: string;
  name: string;
  logo?: string;
  models_count: number;
  type?: string;
  rate_limit?: string;
  description?: string;
  modalities: string[];
}

export default function DirectoryClient({ providers, dict, lang }: { providers: Provider[], dict: any, lang: string }) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortMode, setSortMode] = useState<string>("popular");
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filters = ["all", "text", "vision", "image", "audio", "video", "code"];

  const filteredProviders = providers.filter((p) => {
    const matchesFilter = activeFilter === "all" || p.modalities.includes(activeFilter);
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    if (sortMode === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortMode === "models") {
      return b.models_count - a.models_count;
    }
    // "popular" is default, we assume it's the original JSON order or we can just keep it as is
    return 0; 
  });

  return (
    <>
      <header className={styles.header}>
        <nav className={`${styles.nav} glass-nav`}>
          <a href="/" className={styles.logo}>
            <img src="/logo.png" alt="TokenAIFree Logo" style={{ height: "36px", width: "auto" }} />
          </a>
          <div className={styles.navLinks}>
            <a href="#direktori">{dict.nav.directory}</a>
            <a href="#cara-kerja">{dict.nav.how_it_works}</a>
            <a href="#sumber">{dict.nav.source}</a>
          </div>
          
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
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
          </div>
          <a href="#direktori" className="btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
            {dict.hero.cta}
          </a>
        </section>

        <section id="cara-kerja" className={styles.sourceSection} style={{ marginTop: "32px" }}>
          <h2 className={styles.sectionTitle}>{dict.directory.how_it_works_title}</h2>
          <p className={styles.sourceText}>
            {dict.directory.how_it_works_desc}
          </p>
        </section>

        <section id="direktori" className={styles.directorySection}>
          <div className={styles.controls}>
            <input 
              type="text" 
              className="input-search" 
              placeholder={dict.directory.search_placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className={styles.filters} style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
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
              <select 
                className="input-search" 
                style={{ width: "auto", padding: "8px 12px", height: "fit-content" }}
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value)}
              >
                <option value="popular">{dict.directory.sort_popular}</option>
                <option value="name">{dict.directory.sort_name}</option>
                <option value="models">{dict.directory.sort_models}</option>
              </select>
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.tableHeader}>
              <span>{dict.directory.table_provider}</span>
              <span>{dict.directory.table_capabilities}</span>
              <span>{dict.directory.table_ratelimit}</span>
              <span>{dict.directory.table_notes}</span>
              <span style={{ textAlign: "right" }}>{dict.directory.table_action}</span>
            </div>
            
            {filteredProviders.map((provider) => (
              <a key={provider.id} href={`/${lang}/provider/${provider.id}`} className={styles.providerRow + " card"}>
                <div className={styles.providerHeader}>
                  <div className={styles.providerLogo}>
                    {provider.logo ? (
                      <img src={provider.logo} alt={provider.name} />
                    ) : (
                      <span>{provider.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <span className={styles.providerName}>{provider.name}</span>
                    <div className={styles.providerMeta}>
                      <span className={styles.modelsCount}>{provider.models_count} {dict.directory.models}</span>
                      {provider.type && <span className={styles.providerType}>{provider.type}</span>}
                    </div>
                  </div>
                </div>
                
                <div className={styles.modalityIcons}>
                  {provider.modalities.map((m) => (
                    <span key={m} className={styles.modalityIcon} title={m}>
                      {m.charAt(0).toUpperCase()}
                    </span>
                  ))}
                </div>
                
                <div className={styles.rateLimit}>{provider.rate_limit || dict.directory.unknown}</div>
                
                <div className={styles.description}>
                  {provider.description || dict.directory.no_desc}
                </div>
                
                <div className={styles.actions}>
                  <span className="btn-primary" style={{ fontSize: "12px", padding: "6px 12px" }}>{dict.directory.view_btn}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section id="sumber" className={styles.sourceSection}>
          <h2 className={styles.sectionTitle}>{dict.directory.source_title}</h2>
          <p className={styles.sourceText}>
            {dict.directory.source_desc} <a href="https://freellm.net" target="_blank" rel="noreferrer" className={styles.sourceLink}>freellm.net</a>, <a href="https://github.com/mnfst/awesome-free-llm-apis" target="_blank" rel="noreferrer" className={styles.sourceLink}>mnfst/awesome-free-llm-apis</a>, dan <a href="https://github.com/cheahjs/free-llm-api-resources" target="_blank" rel="noreferrer" className={styles.sourceLink}>cheahjs/free-llm-api-resources</a>.
            <br /><br />
            {dict.directory.source_desc_2}
          </p>
        </section>
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
