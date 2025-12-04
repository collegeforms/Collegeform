// backend/routes/sitemap.js
import express from "express";
import College from "../models/College.js";
import Blog from "../models/Blog.js"; // Import Blog model

const router = express.Router();
const BASE_URL = "https://collegeforms.in";

// Helper function to format date for sitemap
const formatDateForSitemap = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

// Function to generate sitemap XML
const generateSitemapXML = (staticUrls, colleges, blogs) => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // ✅ Static pages with priorities and changefreq
  staticUrls.forEach(url => {
    xml += `<url>
  <loc>${BASE_URL}${url.path}</loc>
  <changefreq>${url.changefreq}</changefreq>
  <priority>${url.priority}</priority>
  <lastmod>${formatDateForSitemap(new Date())}</lastmod>
</url>\n`;
  });

  // ✅ Dynamic college pages
  colleges.forEach(college => {
    xml += `<url>
  <loc>${BASE_URL}/college/${college.slug}</loc>
  <lastmod>${formatDateForSitemap(college.updatedAt)}</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.9</priority>
</url>\n`;
  });

  // ✅ Dynamic blog pages
  blogs.forEach(blog => {
    xml += `<url>
  <loc>${BASE_URL}/blog/${blog.slug}</loc>
  <lastmod>${formatDateForSitemap(blog.updatedAt)}</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>\n`;
  });

  xml += `</urlset>`;
  return xml;
};

router.get("/sitemap.xml", async (req, res) => {
  try {
    console.log("🔄 Generating dynamic sitemap...");
    
    // Define static pages with their priorities and changefreq
    const staticUrls = [
      { path: "/", changefreq: "daily", priority: "1.0" },
      { path: "/studyabroad", changefreq: "weekly", priority: "0.8" },
      { path: "/contactus", changefreq: "monthly", priority: "0.5" },
      { path: "/events", changefreq: "weekly", priority: "0.6" },
      { path: "/students/tests", changefreq: "weekly", priority: "0.7" },
      { path: "/colleges", changefreq: "daily", priority: "0.9" },
      { path: "/offer", changefreq: "monthly", priority: "0.5" },
      { path: "/step", changefreq: "monthly", priority: "0.5" },
      { path: "/blogs", changefreq: "daily", priority: "0.8" },
      { path: "/myaccount", changefreq: "monthly", priority: "0.3" },
      { path: "/video", changefreq: "weekly", priority: "0.6" },
      { path: "/change-password", changefreq: "yearly", priority: "0.1" },
      { path: "/user/login", changefreq: "monthly", priority: "0.2" },
      { path: "/user/signup", changefreq: "monthly", priority: "0.2" },
      { path: "/user/forgot-password", changefreq: "yearly", priority: "0.1" },
      { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
      { path: "/terms", changefreq: "yearly", priority: "0.3" },
      { path: "/courses", changefreq: "weekly", priority: "0.8" },
      { path: "/exams", changefreq: "weekly", priority: "0.7" },
      { path: "/about", changefreq: "monthly", priority: "0.6" }
    ];

    // ✅ Fetch colleges from MongoDB
    const colleges = await College.find({ 
      isActive: true 
    }).select('slug updatedAt').sort({ updatedAt: -1 });

    // ✅ Fetch blogs from MongoDB
    const blogs = await Blog.find({
      isFeatured: { $in: [true, false] } // Get all blogs
    }).select('slug updatedAt').sort({ updatedAt: -1 });

    console.log(`📊 Sitemap Stats: ${staticUrls.length} static URLs, ${colleges.length} colleges, ${blogs.length} blogs`);

    // Generate XML
    const xml = generateSitemapXML(staticUrls, colleges, blogs);

    // Set headers and send response
    res.header("Content-Type", "application/xml");
    res.header("Cache-Control", "public, max-age=3600"); // Cache for 1 hour
    res.send(xml);

    console.log("✅ Sitemap generated successfully");

  } catch (error) {
    console.error("❌ Sitemap generation error:", error);
    res.status(500).send("Error generating sitemap");
  }
});

// Optional: Create sitemap index for large sites
router.get("/sitemap-index.xml", async (req, res) => {
  try {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    
    xml += `<sitemap>
  <loc>${BASE_URL}/sitemap.xml</loc>
  <lastmod>${formatDateForSitemap(new Date())}</lastmod>
</sitemap>\n`;
    
    xml += `</sitemapindex>`;
    
    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error("Sitemap index error:", error);
    res.status(500).send("Error generating sitemap index");
  }
});

export default router;