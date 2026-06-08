import fs from "fs/promises";
import path from "path";
import DirectoryClient from "@/components/DirectoryClient";
import { getDictionary } from "@/app/dictionaries";

export const dynamic = 'force-dynamic';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await params;
  const lang = (resolvedParams.lang as 'en' | 'id') || 'en';
  const dict = await getDictionary(lang);

  // Read static data at build time
  const dataPath = path.join(process.cwd(), "src", "data", "providers.json");
  const lastUpdatedPath = path.join(process.cwd(), "src", "data", "last-updated.json");
  let providers = [];
  let lastUpdatedAt = null;
  
  try {
    const fileContents = await fs.readFile(dataPath, "utf8");
    providers = JSON.parse(fileContents);
  } catch (error) {
    console.error("Failed to load providers.json:", error);
    // Fallback if the file doesn't exist yet
  }

  try {
    const fileContents = await fs.readFile(lastUpdatedPath, "utf8");
    lastUpdatedAt = JSON.parse(fileContents).lastUpdatedAt;
  } catch (error) {
    // Silently ignore if not generated yet
  }

  return <DirectoryClient providers={providers} dict={dict} lang={lang} lastUpdatedAt={lastUpdatedAt} />;
}
