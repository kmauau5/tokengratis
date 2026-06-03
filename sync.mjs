import fs from 'fs/promises';
import path from 'path';

// Mock function to simulate fetching JSON from a community source
async function fetchSourceA() {
  console.log("Fetching Source A (JSON)...");
  return [
    {
      id: "google-gemini",
      name: "Google Gemini",
      logo: "https://tokengratis.id/logos/google-gemini.png",
      models_count: 14,
      type: "Provider API",
      rate_limit: "Free tier available",
      description: "Free tier unavailable in EU/UK/Switzerland.",
      modalities: ["text", "image", "audio", "video"]
    },
    {
      id: "groq",
      name: "Groq",
      logo: "https://tokengratis.id/logos/groq.png",
      models_count: 20,
      type: "Inference",
      rate_limit: "Free tier, no credit card",
      description: "Ultra-fast LPU inference.",
      modalities: ["text", "vision", "audio"]
    }
  ];
}

// Mock function to simulate scraping an HTML table
async function fetchSourceB() {
  console.log("Fetching Source B (HTML Table)...");
  return [
    {
      id: "openrouter",
      name: "OpenRouter",
      logo: "https://tokengratis.id/logos/openrouter.png",
      models_count: 47,
      type: "Inference",
      rate_limit: "~28 model free",
      description: "~28 free models. OpenAI SDK-compatible.",
      modalities: ["text", "image", "audio", "code"]
    },
    {
      id: "google-gemini", // Duplicate ID to test merging
      name: "Google Gemini",
      models_count: 10, // Lower priority source
      modalities: ["text"]
    }
  ];
}

// Mock function to simulate parsing a Markdown file
async function fetchSourceC() {
  console.log("Fetching Source C (Markdown)...");
  return [
    {
      id: "deepseek",
      name: "DeepSeek",
      logo: "https://tokengratis.id/logos/deepseek.png",
      models_count: 2,
      type: "Provider API",
      rate_limit: "5M token",
      description: "5M free tokens on signup, no credit card.",
      modalities: ["text"]
    }
  ];
}

async function main() {
  try {
    const [sourceA, sourceB, sourceC] = await Promise.all([
      fetchSourceA(),
      fetchSourceB(),
      fetchSourceC()
    ]);

    console.log("Normalizing and merging data...");

    const allData = [...sourceA, ...sourceB, ...sourceC];
    
    // Deduplicate by ID, keeping the first occurrence (highest priority)
    const providerMap = new Map();
    for (const item of allData) {
      if (!providerMap.has(item.id)) {
        providerMap.set(item.id, item);
      } else {
        // Optionally merge missing fields here instead of just overwriting
        const existing = providerMap.get(item.id);
        const merged = { ...item, ...existing }; // existing takes precedence
        providerMap.set(item.id, merged);
      }
    }

    const finalProviders = Array.from(providerMap.values());

    // Sort alphabetically by name
    finalProviders.sort((a, b) => a.name.localeCompare(b.name));

    const outputPath = path.join(process.cwd(), 'src', 'data', 'providers.json');
    
    // Ensure directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    
    await fs.writeFile(outputPath, JSON.stringify(finalProviders, null, 2));
    
    console.log(`Successfully generated ${finalProviders.length} providers to ${outputPath}`);
  } catch (error) {
    console.error("Error during sync:", error);
    process.exit(1);
  }
}

main();
