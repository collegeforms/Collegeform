import express from "express";
import College from "../models/College.js";
import Blog from "../models/Blog.js";

const router = express.Router();
const BASE_URL = "https://www.collegeforms.in";

// Helper to escape XML special characters
const escapeXml = (unsafe) => {
    if (!unsafe) return '';
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
};

// Helper to format date
const formatDate = (date) => {
    if (!date) return new Date().toISOString().split('T')[0];
    return new Date(date).toISOString().split('T')[0];
};

router.get("/sitemap.xml", async (req, res) => {
    try {
        console.log("🔄 Generating comprehensive XML sitemap...");
        
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
        
        const staticPages = [
            { url: '/', priority: '1.0', changefreq: 'daily' },
            { url: '/home', priority: '1.0', changefreq: 'daily' },
            
            { url: '/colleges', priority: '0.9', changefreq: 'daily' },
            { url: '/step', priority: '0.7', changefreq: 'weekly' },
            { url: '/offer', priority: '0.7', changefreq: 'weekly' },
            { url: '/education/education-loan', priority: '0.6', changefreq: 'monthly' },
            { url: '/education/accommodation', priority: '0.6', changefreq: 'monthly' },
            { url: '/CompetitiveExams', priority: '0.7', changefreq: 'weekly' },
            
            { url: '/studyabroad', priority: '0.8', changefreq: 'weekly' },
            
            { url: '/students/tests', priority: '0.7', changefreq: 'weekly' },
            
            { url: '/blogs', priority: '0.8', changefreq: 'daily' },
            
            { url: '/events', priority: '0.7', changefreq: 'weekly' },
            
            { url: '/myaccount', priority: '0.3', changefreq: 'monthly' },
            { url: '/cart', priority: '0.5', changefreq: 'weekly' },
            { url: '/user/login', priority: '0.2', changefreq: 'monthly' },
            { url: '/user/signup', priority: '0.2', changefreq: 'monthly' },
            
            { url: '/contactus', priority: '0.7', changefreq: 'monthly' },
            { url: '/FAQ', priority: '0.6', changefreq: 'monthly' },
            
            { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
            { url: '/terms', priority: '0.3', changefreq: 'yearly' },
            
            
            { url: '/education/overseas', priority: '0.7', changefreq: 'weekly' },
        ];
        
        // Add static pages
        staticPages.forEach(page => {
            xml += `  <url>\n`;
            xml += `    <loc>${BASE_URL}${page.url}</loc>\n`;
            xml += `    <lastmod>${formatDate(new Date())}</lastmod>\n`;
            xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
            xml += `    <priority>${page.priority}</priority>\n`;
            xml += `  </url>\n`;
        });
        
        // =============== DYNAMIC COLLEGE PAGES ===============
        try {
            // Only get colleges that have slugs and are active
            const colleges = await College.find({ 
                slug: { $exists: true, $ne: null, $ne: '' }
            })
            .select('slug updatedAt')
            .sort({ updatedAt: -1 })
            .limit(5000)
            .lean();
            
            console.log(`📊 Found ${colleges.length} colleges with slugs`);
            
            colleges.forEach(college => {
                // Double-check slug exists and is valid
                if (college.slug && college.slug.trim()) {
                    const escapedSlug = escapeXml(college.slug.trim());
                    xml += `  <url>\n`;
                    xml += `    <loc>${BASE_URL}/college/${escapedSlug}</loc>\n`;
                    xml += `    <lastmod>${formatDate(college.updatedAt)}</lastmod>\n`;
                    xml += `    <changefreq>weekly</changefreq>\n`;
                    xml += `    <priority>0.8</priority>\n`;
                    xml += `  </url>\n`;
                }
            });
            
            console.log(`✅ Added ${colleges.length} colleges to sitemap`);
            
        } catch (collegeError) {
            console.error("❌ College fetch error:", collegeError.message);
        }
        
        // =============== DYNAMIC BLOG PAGES ===============
        try {
            const blogs = await Blog.find({ 
                slug: { $exists: true, $ne: null, $ne: '' }
            })
            .select('slug updatedAt')
            .sort({ updatedAt: -1 })
            .limit(1000)
            .lean();
            
            console.log(`📊 Found ${blogs.length} blogs with slugs`);
            
            blogs.forEach(blog => {
                if (blog.slug && blog.slug.trim()) {
                    const escapedSlug = escapeXml(blog.slug.trim());
                    xml += `  <url>\n`;
                    xml += `    <loc>${BASE_URL}/blogs/${escapedSlug}</loc>\n`;
                    xml += `    <lastmod>${formatDate(blog.updatedAt)}</lastmod>\n`;
                    xml += `    <changefreq>monthly</changefreq>\n`;
                    xml += `    <priority>0.8</priority>\n`;
                    xml += `  </url>\n`;
                }
            });
            
            console.log(`✅ Added ${blogs.length} blogs to sitemap`);
            
        } catch (blogError) {
            console.error("❌ Blog fetch error:", blogError.message);
        }
        
        // =============== ADDITIONAL PAGES ===============
        // Add pages with specific IDs/categories if needed
        const additionalPages = [
            // Example: Specific education categories
            '/education/engineering',
          
        ];
        
        additionalPages.forEach(page => {
            xml += `  <url>\n`;
            xml += `    <loc>${BASE_URL}${page}</loc>\n`;
            xml += `    <lastmod>${formatDate(new Date())}</lastmod>\n`;
            xml += `    <changefreq>monthly</changefreq>\n`;
            xml += `    <priority>0.5</priority>\n`;
            xml += `  </url>\n`;
        });
        
        // Close XML
        xml += '</urlset>';
        
        // Set headers
        res.set({
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600'
        });
        
        // Send response
        res.send(xml);
        console.log("✅ Comprehensive XML sitemap generated successfully");
        
    } catch (error) {
        console.error("❌ Sitemap generation failed:", error);
        
        // Simple fallback sitemap
        const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/colleges</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${BASE_URL}/blogs</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
        
        res.set('Content-Type', 'application/xml; charset=utf-8');
        res.send(fallbackXml);
    }
});




export default router;