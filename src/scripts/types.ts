export interface Source {
  name: string;
  url: string;
}

export interface Provider {
  id: string;
  name: string;
  slug: string;
  type: string;
  domain: string;
  logoUrl?: string;
  apiKeyUrl?: string;
  baseUrl?: string;
  freeSummary?: string;
  notes?: string;
  modelCount: number;
  maxContext?: string;
  capabilities: string[];
  sources: Source[];
  lastSyncedAt: string;
}

export interface Model {
  id: string;
  providerSlug: string;
  name: string;
  modelId: string;
  modality: string[];
  context?: string;
  output?: string;
  rateLimit?: string;
  isFree?: boolean;
  notes?: string;
}
