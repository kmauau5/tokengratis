import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Logo from "@/components/Logo";

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), "src/data/providers.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const providers = JSON.parse(fileContents);

  return providers.map((provider: any) => ({
    id: provider.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const filePath = path.join(process.cwd(), "src/data/providers.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const providers = JSON.parse(fileContents);
  
  const provider = providers.find((p: any) => p.id === resolvedParams.id);
  
  if (!provider) return { title: "Not Found" };
  
  return {
    title: `${provider.name} API Gratis — TokenAIFree`,
    description: provider.description || `Informasi API gratis dari ${provider.name}.`,
  };
}

export default async function ProviderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const filePath = path.join(process.cwd(), "src/data/providers.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const providers = JSON.parse(fileContents);
  
  const provider = providers.find((p: any) => p.id === resolvedParams.id);

  if (!provider) {
    notFound();
  }

  return (
    <>
      <header className="container" style={{ padding: "24px 16px" }}>
        <nav className="glass-nav" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderRadius: "var(--radius-full)" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <img src="/logo.png" alt="TokenAIFree Logo" style={{ height: "36px", width: "auto" }} />
          </Link>
          <Link href="/" style={{ color: "var(--color-mute)", transition: "color 0.2s", textDecoration: "none" }}>
            &larr; Kembali
          </Link>
        </nav>
      </header>

      <main className="container" style={{ padding: "40px 16px", minHeight: "70vh" }}>
        <div className="card" style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "32px", flexWrap: "wrap" }}>
            {provider.logo ? (
              <img src={provider.logo} alt={provider.name} style={{ width: "80px", height: "80px", borderRadius: "var(--radius-md)", backgroundColor: "#fff", padding: "8px", objectFit: "contain" }} />
            ) : (
              <div style={{ width: "80px", height: "80px", borderRadius: "var(--radius-md)", backgroundColor: "var(--color-ink-line)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "bold" }}>
                {provider.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 style={{ fontSize: "36px", marginBottom: "8px", fontFamily: "var(--font-serif)" }}>{provider.name}</h1>
              <div style={{ display: "flex", gap: "12px", color: "var(--color-mute)", fontSize: "16px" }}>
                <span className="badge-success">{provider.models_count} model</span>
                {provider.type && <span>• {provider.type}</span>}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            <div>
              <h3 style={{ fontSize: "14px", color: "var(--color-mute)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Modalitas</h3>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {provider.modalities.map((m: string) => (
                  <span key={m} className="badge-success" style={{ backgroundColor: "var(--color-ink-line)", color: "var(--color-fog)", borderColor: "transparent" }}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "14px", color: "var(--color-mute)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>Rate Limit Gratis</h3>
              <p style={{ fontSize: "16px", color: "var(--color-grass)", fontWeight: 500 }}>{provider.rate_limit || "Tidak diketahui"}</p>
            </div>
          </div>

          <div style={{ marginTop: "32px", paddingTop: "32px", borderTop: "1px solid var(--color-ink-line)" }}>
            <h3 style={{ fontSize: "14px", color: "var(--color-mute)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>Catatan</h3>
            <p style={{ fontSize: "16px", lineHeight: 1.6 }}>{provider.description || "Tidak ada deskripsi tambahan."}</p>
          </div>
        </div>
      </main>
    </>
  );
}
