import fs from "fs";
import fetch from "node-fetch";

// Backend ka sitemap URL
const BACKEND_SITEMAP =  "https://www.collegeforms.in";


// Output file frontend ke public folder me
const OUTPUT_PATH = "./public/sitemap.xml";

async function fetchSitemap() {
  try {
    const res = await fetch(BACKEND_SITEMAP);
    if (!res.ok) throw new Error(`Failed: ${res.status} ${res.statusText}`);

    const xml = await res.text();
    console.log(xml);
    
    fs.writeFileSync(OUTPUT_PATH, xml);
    console.log("✅ Sitemap copied to public/sitemap.xml");
  } catch (err) {
    console.error("❌ Error fetching sitemap:", err.message);
    process.exit(1);
  }
}

fetchSitemap();
