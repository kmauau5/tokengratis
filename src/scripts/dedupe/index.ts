import { Provider, Model } from '../types';

export function dedupeProviders(providers: Provider[]): Provider[] {
  const map = new Map<string, Provider>();

  for (const provider of providers) {
    if (!map.has(provider.slug)) {
      map.set(provider.slug, { ...provider });
    } else {
      // Merge logic: prefer existing but fill in gaps, append sources
      const existing = map.get(provider.slug)!;
      existing.name = existing.name || provider.name;
      existing.type = existing.type || provider.type;
      existing.domain = existing.domain || provider.domain;
      existing.apiKeyUrl = existing.apiKeyUrl || provider.apiKeyUrl;
      existing.baseUrl = existing.baseUrl || provider.baseUrl;
      existing.freeSummary = existing.freeSummary || provider.freeSummary;
      existing.notes = existing.notes || provider.notes;
      
      // Merge sources safely
      for (const src of provider.sources) {
        if (!existing.sources.find(s => s.name === src.name)) {
          existing.sources.push(src);
        }
      }
    }
  }

  return Array.from(map.values());
}

export function dedupeModels(models: Model[]): Model[] {
  const map = new Map<string, Model>();

  for (const model of models) {
    // Generate a unique ID based on provider slug and model id
    const uniqueId = `${model.providerSlug}-${model.modelId}`;
    if (!map.has(uniqueId)) {
      map.set(uniqueId, { ...model, id: uniqueId });
    } else {
      const existing = map.get(uniqueId)!;
      existing.context = existing.context || model.context;
      existing.output = existing.output || model.output;
      existing.rateLimit = existing.rateLimit || model.rateLimit;
      existing.notes = existing.notes || model.notes;
      // Merge modalities
      model.modality.forEach(m => {
        if (!existing.modality.includes(m.toLowerCase())) {
          existing.modality.push(m.toLowerCase());
        }
      });
    }
  }

  return Array.from(map.values());
}
