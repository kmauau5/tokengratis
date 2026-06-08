"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./ProviderDetail.module.css";

export default function ProviderDetailClient({ provider, models = [], dict, lang }: { provider: any, models: any[], dict: any, lang: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const filteredModels = models.filter((m: any) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.id && m.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredModels.length / itemsPerPage);
  const currentModels = filteredModels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const getModalityIcon = (modality: string) => {
    switch(modality.toLowerCase()) {
      case "text":
        return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/></svg>;
      case "vision":
      case "image":
        return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>;
      case "audio":
        return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>;
      case "video":
        return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/><path d="M2 14h20"/><path d="M7 5v4"/><path d="M17 5v4"/><path d="M7 15v4"/><path d="M17 15v4"/></svg>;
      case "code":
        return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
      case "embeddings":
        return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>;
      case "reranking":
        return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" x2="12" y1="5" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>;
      default:
        return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>;
    }
  };

  return (
    <div className={styles.container}>
      {/* HEADER SECTION */}
      <div className={styles.headerArea}>
        <Link href={`/${lang}`} className={styles.backLink}>
          &larr; {dict.provider.back}
        </Link>
        <div className={styles.headerCard}>
          <div className={styles.headerContent}>
            <div className={styles.logoWrapper}>
              {provider.logoUrl ? (
                <img src={provider.logoUrl} alt={provider.name} className={styles.logo} />
              ) : (
                <div className={styles.logoFallback}>{provider.name.charAt(0)}</div>
              )}
            </div>
            <div className={styles.headerDetails}>
              <h1 className={styles.title}>{provider.name}</h1>
              <div className={styles.badges}>
                {provider.type && <span className={styles.badgeSolid}>{provider.type}</span>}
                <span className={styles.badgeOutline}>{provider.modelCount} {dict.provider.models}</span>
                {provider.maxContext && <span className={styles.badgeOutline}>{dict.provider.max_context} {provider.maxContext}</span>}
              </div>
              <div className={styles.modalityIcons}>
                {provider.capabilities && provider.capabilities.map((mod: string) => (
                  <span key={mod} className={styles.iconBox} title={mod}>
                    {getModalityIcon(mod)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-COLUMN LAYOUT */}
      <div className={styles.gridContainer}>
        {/* LEFT COLUMN */}
        <div className={styles.mainColumn}>
          
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{dict.provider.notes_source}</h2>
            <p className={styles.cardText}>{provider.notes || dict.directory.no_desc}</p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{dict.provider.claim_title}</h2>
            <p className={styles.cardSubtitle}>{dict.provider.claim_subtitle}</p>
            <ol className={styles.claimSteps}>
              <li>
                <a href={provider.apiKeyUrl || "#"} target="_blank" rel="noreferrer" className={styles.linkText}>
                  {dict.provider.claim_step1} {provider.name} ↗
                </a>
              </li>
              <li>{dict.provider.claim_step2}</li>
              <li>{dict.provider.claim_step3}</li>
              <li>
                {dict.provider.claim_step4} <code className={styles.codeSnippet}>{provider.baseUrl || "https://api.example.com"}</code> {dict.provider.claim_step4_sdk}
              </li>
            </ol>
          </div>

          <div className={styles.card}>
            <div className={styles.tableHeaderSection}>
              <h2 className={styles.cardTitle}>{dict.provider.models_available} ({filteredModels.length})</h2>
              <input
                type="text"
                className={styles.searchInput}
                placeholder={dict.provider.search_model}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            
            <div className={styles.tableWrapper}>
              <table className={styles.modelsTable}>
                <thead>
                  <tr>
                    <th>{dict.provider.table_model}</th>
                    <th>{dict.provider.table_modality}</th>
                    <th>{dict.provider.table_context}</th>
                    <th>{dict.provider.table_output}</th>
                    <th>{dict.provider.table_ratelimit}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentModels.length > 0 ? (
                    currentModels.map((model: any, idx: number) => (
                      <tr key={idx}>
                        <td>
                          <div className={styles.modelName}>{model.name}</div>
                          {model.id && <div className={styles.modelId}>{model.id}</div>}
                        </td>
                        <td>{Array.isArray(model.modality) ? model.modality.join(", ") : model.modality}</td>
                        <td className={styles.fontBold}>{model.context}</td>
                        <td>{model.output || "—"}</td>
                        <td>{model.rateLimit || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center", padding: "32px" }}>
                        Data tidak ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className={styles.pagination}>
              <div className={styles.pageInfo}>
                {dict.provider.page} {filteredModels.length > 0 ? currentPage : 0}/{totalPages} · {filteredModels.length} {dict.provider.models}
              </div>
              <div className={styles.pageControls}>
                <button 
                  onClick={handlePrev} 
                  disabled={currentPage === 1}
                  className={styles.pageBtn}
                >
                  &larr; {dict.provider.prev}
                </button>
                <button 
                  onClick={handleNext} 
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={styles.pageBtn}
                >
                  {dict.provider.next} &rarr;
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className={styles.sidebarColumn}>
          <div className={styles.card}>
            <a href={provider.apiKeyUrl || "#"} target="_blank" rel="noreferrer" className={styles.primaryBtn}>
              {dict.provider.get_api_key}
            </a>
            
            <div className={styles.sidebarSection}>
              <label className={styles.sidebarLabel}>{dict.provider.base_url}</label>
              <input 
                type="text" 
                readOnly 
                value={provider.baseUrl || ""} 
                className={styles.readonlyInput} 
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
            </div>

            <div className={styles.sidebarStats}>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>{dict.provider.max_context}</span>
                <span className={styles.statValue}>{provider.maxContext || "N/A"}</span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>{dict.provider.jumlah_model}</span>
                <span className={styles.statValue}>{provider.modelCount || 0}</span>
              </div>
              <div className={styles.statRow}>
                <span className={styles.statLabel}>{dict.provider.domain}</span>
                <span className={styles.statValue}>{provider.domain || "N/A"}</span>
              </div>
            </div>

            <div className={styles.sidebarSection} style={{ borderTop: "1px solid var(--color-ink-line)", paddingTop: "16px", marginTop: "16px" }}>
              <label className={styles.sidebarLabel}>{dict.provider.data_source}</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                {provider.sources && provider.sources.map((src: any, idx: number) => (
                  <a key={idx} href={src.url} target="_blank" rel="noreferrer" className={styles.sourceLink} style={{ fontSize: "13px", color: "var(--color-ink)", textDecoration: "underline" }}>
                    {src.name}
                  </a>
                ))}
              </div>
              {provider.lastSyncedAt && (
                <p className={styles.sourceText} style={{ marginTop: "12px", fontSize: "12px", color: "var(--color-mute)" }}>
                  Terakhir disinkronisasi:<br/>
                  {new Date(provider.lastSyncedAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
