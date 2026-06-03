import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getDictionary } from "@/app/dictionaries";

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), "src/data/providers.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const providers = JSON.parse(fileContents);

  const paths: { lang: string, id: string }[] = [];
  
  providers.forEach((provider: any) => {
    paths.push({ lang: 'en', id: provider.id });
    paths.push({ lang: 'id', id: provider.id });
  });

  return paths;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string, lang: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const filePath = path.join(process.cwd(), "src/data/providers.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const providers = JSON.parse(fileContents);
  
  const provider = providers.find((p: any) => p.id === resolvedParams.id);
  
  if (!provider) return { title: "Not Found" };
  
  return {
    title: `${provider.name} API`,
    description: provider.description || `Info API ${provider.name}.`,
  };
}

export default async function ProviderPage({ params }: { params: Promise<{ id: string, lang: string }> }) {
  const resolvedParams = await params;
  const lang = (resolvedParams.lang as 'en' | 'id') || 'en';
  const dict = await getDictionary(lang);
  
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
          <Link href={`/${lang}`} style={{ display: "flex", alignItems: "center" }}>
            <img src="/logo.png" alt="TokenAIFree Logo" style={{ height: "36px", width: "auto" }} />
          </Link>
          <Link href={`/${lang}`} style={{ color: "var(--color-mute)", transition: "color 0.2s", textDecoration: "none" }}>
            &larr; {dict.provider.back}
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
                <span className="badge-success">{provider.models_count} {dict.provider.models}</span>
                {provider.type && <span>• {provider.type}</span>}
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
            <div>
              <h3 style={{ fontSize: "14px", color: "var(--color-mute)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>{dict.provider.modality}</h3>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {provider.modalities.map((m: string) => (
                  <span key={m} className="badge-success" style={{ backgroundColor: "var(--color-ink-line)", color: "var(--color-fog)", borderColor: "transparent" }}>
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: "14px", color: "var(--color-mute)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "1px" }}>{dict.provider.free_rate_limit}</h3>
              <p style={{ fontSize: "16px", color: "var(--color-grass)", fontWeight: 500 }}>{provider.rate_limit || dict.directory.unknown}</p>
            </div>
          </div>

          <div style={{ marginTop: "32px", paddingTop: "32px", borderTop: "1px solid var(--color-ink-line)" }}>
            <h3 style={{ fontSize: "14px", color: "var(--color-mute)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>{dict.provider.notes}</h3>
            <p style={{ fontSize: "16px", lineHeight: 1.6 }}>{provider.description || dict.directory.no_desc}</p>
          </div>

          {provider.models && provider.models.length > 0 && (
            <div style={{ marginTop: "40px" }}>
              <h3 style={{ fontSize: "18px", color: "var(--color-fog)", marginBottom: "16px", fontWeight: 600 }}>{dict.provider.available_models}</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--color-ink-line)", color: "var(--color-mute)" }}>
                      <th style={{ padding: "12px 16px", fontWeight: 600 }}>{dict.provider.model_name}</th>
                      <th style={{ padding: "12px 16px", fontWeight: 600 }}>{dict.provider.context_window}</th>
                      <th style={{ padding: "12px 16px", fontWeight: 600 }}>{dict.provider.description}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {provider.models.map((model: any, index: number) => (
                      <tr key={index} style={{ borderBottom: "1px solid var(--color-ink-line)" }}>
                        <td style={{ padding: "16px", fontWeight: 500, color: "var(--color-fog)" }}>{model.name}</td>
                        <td style={{ padding: "16px", color: "var(--color-mute)" }}>
                          <span style={{ backgroundColor: "var(--color-ink-line)", padding: "2px 6px", borderRadius: "4px", fontSize: "12px" }}>{model.context}</span>
                        </td>
                        <td style={{ padding: "16px", color: "var(--color-mute)", lineHeight: 1.5 }}>{model.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
