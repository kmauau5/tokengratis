import * as cheerio from 'cheerio';
import { Provider, Model, Source } from '../types';

function slugify(text: string): string {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

export function normalizeFreellm(rawData: any[]): { providers: Provider[], models: Model[] } {
  console.log("Normalizing freellm.net data...");
  const providersMap: Map<string, Provider> = new Map();
  const models: Model[] = [];

  if (!rawData || rawData.length === 0 || !rawData[0].content) {
    return { providers: [], models: [] };
  }

  const $ = cheerio.load(rawData[0].content);
  
  $('tbody tr').each((i, el) => {
    const providerName = $(el).find('td').eq(0).text().trim();
    let modelName = $(el).find('td').eq(1).text().trim();
    const context = $(el).find('td').eq(2).text().trim();
    const output = $(el).find('td').eq(3).text().trim();
    
    const modalities = $(el).find('td').eq(4).find('.badge').map((_, badge) => $(badge).text().trim().toLowerCase()).get();
    const rateLimit = $(el).find('td').eq(5).text().trim();

    if (!providerName || !modelName) return;

    const providerSlug = slugify(providerName);
    
    if (!providersMap.has(providerSlug)) {
      providersMap.set(providerSlug, {
        id: providerSlug,
        slug: providerSlug,
        name: providerName,
        type: "Aggregator",
        domain: providerSlug + ".com", // Placeholder
        modelCount: 0,
        capabilities: [],
        sources: [{ name: "freellm.net", url: "https://freellm.net" }],
        lastSyncedAt: new Date().toISOString()
      });
    }

    const provider = providersMap.get(providerSlug)!;
    
    // Some model names have provider prefix, like "NVIDIA: Nemotron"
    if (modelName.startsWith(providerName + ":")) {
        modelName = modelName.substring(providerName.length + 1).trim();
    }
    // Remove "(free)" from model name if present
    modelName = modelName.replace(/\(free\)/i, "").trim();

    models.push({
      id: `${providerSlug}-${slugify(modelName)}`,
      providerSlug: providerSlug,
      modelId: slugify(modelName),
      name: modelName,
      modality: modalities,
      context: context,
      output: output,
      rateLimit: rateLimit,
      source: "freellm.net"
    } as any);
  });

  return { providers: Array.from(providersMap.values()), models };
}

export function normalizeAwesome(rawData: any[]): { providers: Provider[], models: Model[] } {
  console.log("Normalizing awesome-free-llm-apis data...");
  const providersMap: Map<string, Provider> = new Map();
  const models: Model[] = [];

  if (!rawData || rawData.length === 0 || !rawData[0].content) {
    return { providers: [], models: [] };
  }

  const md = rawData[0].content as string;
  let currentProviderSlug: string | null = null;
  let currentNotes: string[] = [];

  const lines = md.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Provider header
    const providerMatch = line.match(/^### \[([^\]]+)\]\(([^)]+)\)/);
    if (providerMatch) {
      const providerName = providerMatch[1];
      const providerUrl = providerMatch[2];
      currentProviderSlug = slugify(providerName);
      currentNotes = [];
      
      providersMap.set(currentProviderSlug, {
        id: currentProviderSlug,
        slug: currentProviderSlug,
        name: providerName,
        type: "Direct",
        domain: new URL(providerUrl).hostname,
        apiKeyUrl: providerUrl,
        modelCount: 0,
        capabilities: [],
        sources: [{ name: "mnfst/awesome-free-llm-apis", url: "https://github.com/mnfst/awesome-free-llm-apis" }],
        lastSyncedAt: new Date().toISOString(),
        notes: ""
      });
      continue;
    }

    if (!currentProviderSlug) continue;
    const provider = providersMap.get(currentProviderSlug)!;

    // Base URL extraction
    const baseUrlMatch = line.match(/^Base URL: `([^`]+)`/i);
    if (baseUrlMatch) {
      provider.baseUrl = baseUrlMatch[1];
      continue;
    }

    // Collect notes (sentences before tables)
    if (line !== "" && !line.startsWith("|") && !line.startsWith("Base URL") && !line.startsWith("###")) {
      currentNotes.push(line);
      provider.notes = currentNotes.join(" ");
    }

    // Table rows
    if (line.startsWith("|") && !line.includes("---") && !line.includes("Model Name")) {
      const cols = line.split("|").map(s => s.trim()).filter(s => s.length > 0);
      if (cols.length >= 5) {
        const modelName = cols[0];
        const context = cols[1];
        const output = cols[2];
        const modalityStr = cols[3];
        const rateLimit = cols[4];

        if (modelName && modelName.length > 0) {
          models.push({
            id: `${currentProviderSlug}-${slugify(modelName)}`,
            providerSlug: currentProviderSlug,
            modelId: slugify(modelName),
            name: modelName,
            modality: modalityStr.split(/[\s,+]+/).map(s => s.toLowerCase().trim()).filter(s => s !== "" && s !== "text" && s !== "image" && s !== "audio" && s !== "video" && s !== "code" && s !== "embeddings" && s !== "reranking" ? false : true),
            context: context !== "—" ? context : undefined,
            output: output !== "—" ? output : undefined,
            rateLimit: rateLimit,
            source: "mnfst"
          } as any);
        }
      }
    }
  }

  // Final cleanup on modalities if parser failed due to strange formats
  models.forEach(m => {
    if (m.modality.length === 0) m.modality = ["text"]; 
  });

  return { providers: Array.from(providersMap.values()), models };
}

export function normalizeResources(rawData: any[]): { providers: Provider[], models: Model[] } {
  console.log("Normalizing free-llm-api-resources data...");
  const providersMap: Map<string, Provider> = new Map();
  const models: Model[] = [];

  if (!rawData || rawData.length === 0 || !rawData[0].content) {
    return { providers: [], models: [] };
  }

  const md = rawData[0].content as string;
  let currentProviderSlug: string | null = null;
  let currentFreeSummary: string[] = [];
  
  const lines = md.split('\n');
  let inLimitsSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Provider header
    const providerMatch = line.match(/^### \[([^\]]+)\]\(([^)]+)\)/);
    if (providerMatch) {
      const providerName = providerMatch[1];
      const providerUrl = providerMatch[2];
      currentProviderSlug = slugify(providerName);
      currentFreeSummary = [];
      inLimitsSection = false;
      
      if (!providersMap.has(currentProviderSlug)) {
        providersMap.set(currentProviderSlug, {
          id: currentProviderSlug,
          slug: currentProviderSlug,
          name: providerName,
          type: "Direct",
          domain: new URL(providerUrl).hostname,
          modelCount: 0,
          capabilities: [],
          sources: [{ name: "cheahjs/free-llm-api-resources", url: "https://github.com/cheahjs/free-llm-api-resources" }],
          lastSyncedAt: new Date().toISOString(),
          freeSummary: ""
        });
      }
      continue;
    }

    if (!currentProviderSlug) continue;
    const provider = providersMap.get(currentProviderSlug)!;

    if (line === "**Limits:**") {
      inLimitsSection = true;
      continue;
    }

    if (inLimitsSection && line !== "" && !line.startsWith("-")) {
      // Clean HTML breaks
      let cleanLine = line.replace(/<br>/gi, " ").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
      currentFreeSummary.push(cleanLine);
      provider.freeSummary = currentFreeSummary.join(" ");
    }

    if (line.startsWith("- [") || line.startsWith("- ")) {
      inLimitsSection = false; // limits ended
      const modelMatch = line.match(/^- \[([^\]]+)\]\(([^)]+)\)/);
      let modelName = "";
      if (modelMatch) {
        modelName = modelMatch[1];
      } else {
        modelName = line.replace(/^- /, "");
      }
      
      if (modelName) {
        models.push({
          id: `${currentProviderSlug}-${slugify(modelName)}`,
          providerSlug: currentProviderSlug,
          modelId: slugify(modelName),
          name: modelName,
          modality: ["text"], // Markdown list doesn't specify modality, assume text
          source: "cheahjs"
        } as any);
      }
    }
  }

  return { providers: Array.from(providersMap.values()), models };
}
