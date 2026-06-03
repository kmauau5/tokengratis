"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import styles from "./DirectoryClient.module.css";

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

export default function DirectoryClient({ providers }: { providers: Provider[] }) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
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
  });

  return (
    <>
      <header className={styles.header}>
        <nav className={`${styles.nav} glass-nav`}>
          <a href="/" className={styles.logo}>
            TokenAIFree
          </a>
          <div className={styles.navLinks}>
            <a href="#direktori">Direktori</a>
            <a href="#cara-kerja">Cara kerja</a>
            <a href="#sumber">Sumber</a>
            {mounted && (
              <button 
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className={styles.themeToggle}
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? "☀️ Terang" : "🌙 Gelap"}
              </button>
            )}
          </div>
          <a href="#direktori" className="btn-primary">
            Lihat direktori
          </a>
        </nav>
      </header>

      <main className="container">
        <section className={styles.hero}>
          <h1 className={styles.title}>
            API AI yang bisa<br />dipake gratis
          </h1>
          <p className={styles.subtitle}>
            Free tier & free credits API LLM — di-aggregate otomatis dari sumber komunitas. Tiap provider nampilin model, context window, rate limit & modality apa adanya.
          </p>
          <span className="badge-success">
            ✅ {providers.length} provider · Ratusan model gratis
          </span>
        </section>

        <section id="direktori" className={styles.directorySection}>
          <div className={styles.controls}>
            <input 
              type="search" 
              placeholder="Cari provider atau model — Gemini, Groq, DeepSeek..." 
              className="input-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className={styles.filters}>
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`${styles.filterBtn} ${activeFilter === f ? styles.filterBtnActive : ""}`}
                >
                  {f === "all" ? "Semua" : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.tableHeader}>
              <span>Provider</span>
              <span>Kemampuan</span>
              <span>Rate limit</span>
              <span>Catatan</span>
              <span style={{ textAlign: "right" }}>Aksi</span>
            </div>
            
            {filteredProviders.map((provider) => (
              <a key={provider.id} href={`#${provider.id}`} className={styles.providerRow + " card"}>
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
                      <span className={styles.modelsCount}>{provider.models_count} model</span>
                      {provider.type && <span className={styles.providerType}>{provider.type}</span>}
                    </div>
                  </div>
                </div>

                <div className={styles.modalityIcons}>
                  {provider.modalities.map(m => (
                    <span key={m} className={styles.modalityIcon} title={m}>
                      {m === 'text' ? 'T' : m.charAt(0).toUpperCase()}
                    </span>
                  ))}
                </div>

                {provider.rate_limit && (
                  <div className={styles.rateLimit}>{provider.rate_limit}</div>
                )}

                {provider.description && (
                  <p className={styles.description}>{provider.description}</p>
                )}

                <div className={styles.actions}>
                  <span className="btn-primary" style={{ padding: "6px 12px", fontSize: "13px" }}>Lihat</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section id="sumber" className={styles.sourceSection}>
          <h2 className={styles.sectionTitle}>Sumber Data</h2>
          <p className={styles.sourceText}>
            Informasi pada situs ini dihimpun secara otomatis dari sumber terbuka seperti komunitas <a href="https://freellm.net" target="_blank" rel="noreferrer" className={styles.sourceLink}>freellm.net</a>, <a href="https://github.com/mnfst/awesome-free-llm-apis" target="_blank" rel="noreferrer" className={styles.sourceLink}>mnfst/awesome-free-llm-apis</a>, dan <a href="https://github.com/cheahjs/free-llm-api-resources" target="_blank" rel="noreferrer" className={styles.sourceLink}>cheahjs/free-llm-api-resources</a>.
            <br /><br />
            Peran kami murni sebagai pengumpul (agregator) agar Anda lebih mudah mencarinya. Kami bukanlah pemilik data tersebut, dan bukan pula pihak yang memverifikasi keakuratannya. Setiap profil <i>provider</i> yang tampil merupakan hasil sinkronisasi mentah dari gabungan referensi di atas.
          </p>
        </section>
      </main>

      <footer style={{ marginTop: "80px", borderTop: "1px solid var(--color-ink-line)", padding: "40px 16px", textAlign: "center", color: "var(--color-mute)", fontSize: "14px" }}>
        <div className="container">
          <p>© {new Date().getFullYear()} TokenAIFree. Direktori API AI gratis, di-aggregate otomatis dari sumber komunitas.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginTop: "16px" }}>
            <a href="#" style={{ hover: "color: var(--color-fog)" }}>GitHub</a>
            <a href="#" style={{ hover: "color: var(--color-fog)" }}>Twitter</a>
            <a href="#" style={{ hover: "color: var(--color-fog)" }}>Discord</a>
          </div>
        </div>
      </footer>
    </>
  );
}
