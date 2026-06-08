import fs from "fs/promises";
import path from "path";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getDictionary } from "@/app/dictionaries";
import ProviderDetailClient from "@/components/ProviderDetailClient";

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
    description: provider.notes || `Info API ${provider.name}.`,
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

  let providerModels = [];
  try {
    const modelsFilePath = path.join(process.cwd(), "src/data/models.json");
    const modelsContents = await fs.readFile(modelsFilePath, "utf8");
    const allModels = JSON.parse(modelsContents);
    providerModels = allModels.filter((m: any) => m.providerSlug === provider.slug);
  } catch (error) {
    console.error("Failed to load models.json:", error);
  }

  return <ProviderDetailClient provider={provider} models={providerModels} dict={dict} lang={lang} />;
}
