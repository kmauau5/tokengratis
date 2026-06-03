import fs from "fs/promises";
import path from "path";
import DirectoryClient from "@/components/DirectoryClient";

export default async function Home() {
  // Read static data at build time
  const dataPath = path.join(process.cwd(), "src", "data", "providers.json");
  let providers = [];
  
  try {
    const fileContents = await fs.readFile(dataPath, "utf8");
    providers = JSON.parse(fileContents);
  } catch (error) {
    console.error("Failed to load providers.json:", error);
    // Fallback if the file doesn't exist yet
  }

  return <DirectoryClient providers={providers} />;
}
