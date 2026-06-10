"use client";

import Link from "next/link";
import styles from "@/app/[lang]/donate/Donate.module.css";

const platforms = [
  // Active International Platforms
  { id: 'paypal', name: 'PayPal Donate', color: '#0ea5e9', desc: 'Support via PayPal', link: 'https://paypal.me/kmauau' },
  { id: 'kofi', name: 'Ko-fi', color: '#ec4899', desc: 'Support via Ko-fi', link: 'https://ko-fi.com/kmauau' },
  { id: 'patreon', name: 'Patreon', color: '#f97316', desc: 'Support via Patreon', link: 'https://www.patreon.com/16206997/join' },
  
  // Active Indonesian Platforms
  { id: 'saweria', name: 'Saweria', color: '#f59e0b', desc: 'Support via Saweria (GoPay, OVO, QRIS)', link: 'https://saweria.co/kmauau' },
  { id: 'trakteer', name: 'Trakteer', color: '#ef4444', desc: 'Support us on Trakteer', link: 'https://trakteer.id/kmauau' },
  { id: 'sociabuzz', name: 'SociaBuzz TRIBE', color: '#3b82f6', desc: 'Support us on SociaBuzz', link: 'https://sociabuzz.com/kmauau/tribe' },

  // Other International Platforms
  { id: 'buymeacoffee', name: 'Buy Me a Coffee', color: '#fcd34d', desc: 'Support via Buy Me a Coffee', link: '#' },
  { id: 'gumroad', name: 'Gumroad', color: '#ff90e8', desc: 'Support via Gumroad', link: '#' },
  { id: 'stripe', name: 'Stripe Payment', color: '#6366f1', desc: 'Support via Stripe', link: '#' },
  { id: 'lemonsqueezy', name: 'Lemon Squeezy', color: '#eab308', desc: 'Support via Lemon Squeezy', link: '#' },

  // Other Indonesian Platforms
  { id: 'karyakarsa', name: 'KaryaKarsa', color: '#10b981', desc: 'Support us on KaryaKarsa', link: '#' },
  { id: 'nihbuatjajan', name: 'Nih Buat Jajan', color: '#8b5cf6', desc: 'Support us on Nih Buat Jajan', link: '#' },
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
          <a 
            key={p.id} 
            href={p.link}
            target="_blank"
            rel="noreferrer"
            className={styles.card}
            style={{ 
              '--hover-color': p.color, 
              '--hover-shadow': `${p.color}1a`,
              textDecoration: 'none'
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
            <span className={`${styles.actionBtn} ${styles.btnSecondary}`}>
              {dict.donate.btn_donate}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
