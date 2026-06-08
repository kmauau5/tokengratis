import fs from 'fs/promises';
import path from 'path';
import { fetchFreellm, fetchAwesomeFreeLlmApis, fetchFreeLlmApiResources } from './fetchers/index';
import { normalizeFreellm, normalizeAwesome, normalizeResources } from './normalizers/index';
import { dedupeProviders, dedupeModels } from './dedupe/index';

async function main() {
  console.log("Starting data synchronization...");

  try {
    // 1. Fetch raw data
    const [rawFreellm, rawAwesome, rawResources] = await Promise.all([
      fetchFreellm(),
      fetchAwesomeFreeLlmApis(),
      fetchFreeLlmApiResources()
    ]);

    console.log("Data fetched. Normalizing...");

    // 2. Normalize
    const { providers: p1, models: m1 } = normalizeFreellm(rawFreellm);
    const { providers: p2, models: m2 } = normalizeAwesome(rawAwesome);
    const { providers: p3, models: m3 } = normalizeResources(rawResources);

    const allProviders = [...p1, ...p2, ...p3];
    const allModels = [...m1, ...m2, ...m3];

    console.log(`Normalized ${allProviders.length} provider entries and ${allModels.length} model entries.`);
    console.log("Deduplicating...");

    // 3. Deduplicate
    const finalModels = dedupeModels(allModels);
    const uniqueProviders = dedupeProviders(allProviders);

    // 4. Enrich providers with model counts, capabilities, and max context
    const parseContext = (ctx?: string) => {
      if (!ctx) return 0;
      const clean = ctx.toUpperCase().replace(/[^0-9.KMB]/g, '');
      let multiplier = 1;
      if (clean.includes('K')) multiplier = 1000;
      if (clean.includes('M')) multiplier = 1000000;
      if (clean.includes('B')) multiplier = 1000000000;
      const num = parseFloat(clean.replace(/[KMB]/g, ''));
      return isNaN(num) ? 0 : num * multiplier;
    };

    const finalProviders = uniqueProviders.map(provider => {
      const providerModels = finalModels.filter(m => m.providerSlug === provider.slug);
      
      // Compute capabilities from models
      const capabilitiesSet = new Set<string>();
      let maxContextVal = 0;
      let maxContextStr = "0";

      providerModels.forEach(m => {
        m.modality.forEach(mod => capabilitiesSet.add(mod.toLowerCase()));
        const cVal = parseContext(m.context);
        if (cVal > maxContextVal) {
          maxContextVal = cVal;
          maxContextStr = m.context || "0";
        }
      });

      return {
        ...provider,
        modelCount: providerModels.length,
        capabilities: Array.from(capabilitiesSet).sort(),
        maxContext: maxContextVal > 0 ? maxContextStr : undefined
      };
    });

    // 5. Sort logically
    finalProviders.sort((a, b) => a.name.localeCompare(b.name));
    finalModels.sort((a, b) => a.id.localeCompare(b.id));

    console.log(`Final output: ${finalProviders.length} providers, ${finalModels.length} models.`);

    // 6. Write to disk
    const dataDir = path.join(process.cwd(), 'src', 'data');
    await fs.mkdir(dataDir, { recursive: true });

    await fs.writeFile(path.join(dataDir, 'providers.json'), JSON.stringify(finalProviders, null, 2));
    await fs.writeFile(path.join(dataDir, 'models.json'), JSON.stringify(finalModels, null, 2));
    await fs.writeFile(path.join(dataDir, 'last-updated.json'), JSON.stringify({ lastUpdatedAt: new Date().toISOString() }, null, 2));

    console.log("Synchronization complete! JSON files written successfully.");
  } catch (err) {
    console.error("Error during synchronization pipeline:", err);
    process.exit(1);
  }
}

main();
