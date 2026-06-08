"use client";

import Link from "next/link";
import styles from "@/app/[lang]/donate/Donate.module.css";

const platforms = [
  // International Platforms
  { id: 'buymeacoffee', name: 'Buy Me a Coffee', color: '#fcd34d', desc: 'Support via Buy Me a Coffee' },
  { id: 'kofi', name: 'Ko-fi', color: '#ec4899', desc: 'Support via Ko-fi' },
  { id: 'patreon', name: 'Patreon', color: '#f97316', desc: 'Support via Patreon' },
  { id: 'paypal', name: 'PayPal Donate', color: '#0ea5e9', desc: 'Support via PayPal' },
  { id: 'gumroad', name: 'Gumroad', color: '#ff90e8', desc: 'Support via Gumroad' },
  { id: 'stripe', name: 'Stripe Payment', color: '#6366f1', desc: 'Support via Stripe' },
  { id: 'lemonsqueezy', name: 'Lemon Squeezy', color: '#eab308', desc: 'Support via Lemon Squeezy' },
  // Indonesian Platforms
  { id: 'saweria', name: 'Saweria', color: '#f59e0b', desc: 'Support via Saweria (GoPay, OVO, QRIS)' },
  { id: 'trakteer', name: 'Trakteer', color: '#ef4444', desc: 'Support us on Trakteer' },
  { id: 'sociabuzz', name: 'SociaBuzz TRIBE', color: '#3b82f6', desc: 'Support us on SociaBuzz' },
  { id: 'karyakarsa', name: 'KaryaKarsa', color: '#10b981', desc: 'Support us on KaryaKarsa' },
  { id: 'nihbuatjajan', name: 'Nih Buat Jajan', color: '#8b5cf6', desc: 'Support us on Nih Buat Jajan' },
];

export default function DonateClient({ dict, lang }: { dict: any; lang: string }) {
  return (
    <div className={styles.container}>
      <Link href={`/${lang}`} className={styles.backBtn}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {dict.donate.back}
      </Link>

      <div className={styles.header}>
        <h1 className={styles.title}>{dict.donate.title}</h1>
        <p className={styles.subtitle}>{dict.donate.subtitle}</p>
      </div>

      <div className={styles.grid}>
        {platforms.map((p) => (
          <div 
            key={p.id} 
            className={styles.card}
            style={{ 
              '--hover-color': p.color, 
              '--hover-shadow': `${p.color}1a` 
            } as React.CSSProperties}
          >
            <div 
              className={styles.iconWrapper} 
              style={{ color: p.color, backgroundColor: `${p.color}1a`, fontSize: '20px', fontWeight: 'bold' }}
            >
              {p.name.charAt(0)}
            </div>
            <h3 className={styles.cardTitle}>{p.name}</h3>
            <p className={styles.cardDesc}>{p.desc}</p>
            <a href="#" target="_blank" rel="noreferrer" className={`${styles.actionBtn} ${styles.btnSecondary}`}>
              {dict.donate.btn_donate}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
