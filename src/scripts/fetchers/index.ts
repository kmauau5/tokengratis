export async function fetchFreellm(): Promise<any[]> {
  console.log("Fetching from freellm.net...");
  try {
    const response = await fetch("https://freellm.net");
    const html = await response.text();
    return [{ type: "freellm_html", content: html }];
  } catch (error) {
    console.error("Error fetching freellm.net:", error);
    return [];
  }
}

export async function fetchAwesomeFreeLlmApis(): Promise<any[]> {
  console.log("Fetching from mnfst/awesome-free-llm-apis...");
  try {
    const response = await fetch("https://raw.githubusercontent.com/mnfst/awesome-free-llm-apis/main/README.md");
    const md = await response.text();
    return [{ type: "awesome_md", content: md }];
  } catch (error) {
    console.error("Error fetching awesome-free-llm-apis:", error);
    return [];
  }
}

export async function fetchFreeLlmApiResources(): Promise<any[]> {
  console.log("Fetching from cheahjs/free-llm-api-resources...");
  try {
    const response = await fetch("https://raw.githubusercontent.com/cheahjs/free-llm-api-resources/main/README.md");
    const md = await response.text();
    return [{ type: "resources_md", content: md }];
  } catch (error) {
    console.error("Error fetching free-llm-api-resources:", error);
    return [];
  }
}
