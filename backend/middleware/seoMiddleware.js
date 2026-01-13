// backend/middleware/seoMiddleware.js
import path from 'path';
import { fileURLToPath } from 'url';
import College from '../models/College.js';
import Course from '../models/course.js';
import Blog from '../models/Blog.js';
import Exam from '../models/Exam.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================
// BOT DETECTION
// ======================

const BOT_USER_AGENTS = [
  'googlebot', 'googlebot-news', 'googlebot-image',
  'bingbot', 'slurp', 'duckduckbot',
  'baiduspider', 'yandexbot', 'sogou',
  'exabot', 'facebookexternalhit',
  'twitterbot', 'rogerbot', 'linkedinbot',
  'embedly', 'quora link preview',
  'showyoubot', 'outbrain', 'pinterest',
  'developers.google.com', 'whatsapp',
  'telegrambot', 'discordbot', 'slackbot',
  'applebot', 'petalbot'
];

const isBotRequest = (userAgent) => {
  if (!userAgent) return false;
  const lowerUA = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => lowerUA.includes(bot));
};

// ======================
// META TAG GENERATOR
// ======================

const getDynamicMetaTags = async (url) => {
  const baseUrl = 'https://www.collegeforms.in';
  const siteName = 'College Forms';
  
  // Default meta tags
  let meta = {
    title: `${siteName} - College Admissions & Application Forms`,
    description: 'Apply to 1000+ colleges in India. Get free admission counseling, application forms for UG/PG courses, entrance exam details & more.',
    keywords: 'college admission, application forms, UG courses, PG courses, entrance exams, India colleges',
    canonical: baseUrl + url.split('?')[0], // Remove query params for canonical
    ogImage: `${baseUrl}/uploads/og-default.jpg`,
    twitterImage: `${baseUrl}/uploads/twitter-default.jpg`,
    structuredData: null
  };

  try {
    const cleanUrl = url.split('?')[0]; // Remove query parameters
    
    // ======================
    // COLLEGE DETAIL PAGE
    // ======================
    if (cleanUrl.startsWith('/college/')) {
      const slug = cleanUrl.split('/college/')[1];
      if (slug) {
        const college = await College.findOne({ slug })
          .populate('courses', 'name')
          .select('name description city state courses logo website accreditation rating');
        
        if (college) {
          const courseNames = college.courses?.map(c => c.name).join(', ') || 'Various courses';
          
          meta.title = `${college.name} | Admission 2024, Courses, Fees, Placement | College Forms`;
          meta.description = `${college.name} in ${college.city}, ${college.state}. ${college.description?.substring(0, 150) || `Offering ${courseNames}. Get admission forms, fees, cutoff, ranking & placement details.`}`;
          meta.keywords = `${college.name}, ${college.city} colleges, ${college.state} colleges, ${college.name} admission, ${college.name} courses`;
          meta.canonical = `${baseUrl}/college/${slug}`;
          meta.ogImage = college.logo ? `${baseUrl}${college.logo}` : meta.ogImage;
          
          // Structured Data for College
          meta.structuredData = {
            "@context": "https://schema.org",
            "@type": "CollegeOrUniversity",
            "name": college.name,
            "description": college.description?.substring(0, 200),
            "url": `${baseUrl}/college/${slug}`,
            "logo": college.logo ? `${baseUrl}${college.logo}` : null,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": college.city,
              "addressRegion": college.state,
              "addressCountry": "IN"
            },
            "aggregateRating": college.rating ? {
              "@type": "AggregateRating",
              "ratingValue": college.rating,
              "reviewCount": college.reviewsCount || 10
            } : undefined
          };
        }
      }
    }
    
    // ======================
    // COURSE DETAIL PAGE
    // ======================
    else if (cleanUrl.startsWith('/course/')) {
      const slug = cleanUrl.split('/course/')[1];
      if (slug) {
        const course = await Course.findOne({ slug })
          .populate('colleges', 'name city')
          .select('title description duration fees eligibility scope');
        
        if (course) {
          const collegeCount = course.colleges?.length || 0;
          
          meta.title = `${course.title} Course - Duration, Fees, Eligibility, Colleges | College Forms`;
          meta.description = `${course.title} course details: ${course.duration} duration, fees ₹${course.fees?.min || 'Varies'}. Eligibility: ${course.eligibility || '10+2'}. Offered by ${collegeCount}+ colleges. Career scope: ${course.scope || 'Excellent opportunities'}`;
          meta.keywords = `${course.title} course, ${course.title} admission, ${course.title} fees, ${course.title} eligibility, ${course.title} colleges`;
          meta.canonical = `${baseUrl}/course/${slug}`;
          
          // Structured Data for Course
          meta.structuredData = {
            "@context": "https://schema.org",
            "@type": "Course",
            "name": course.title,
            "description": course.description,
            "courseCode": course.code || course.title.substring(0, 10).toUpperCase(),
            "timeRequired": course.duration,
            "educationalCredentialAwarded": "Certificate/Diploma/Degree",
            "offers": {
              "@type": "Offer",
              "price": course.fees?.min || "0",
              "priceCurrency": "INR"
            }
          };
        }
      }
    }
    
    // ======================
    // BLOG DETAIL PAGE
    // ======================
    else if (cleanUrl.startsWith('/blog/')) {
      const slug = cleanUrl.split('/blog/')[1];
      if (slug) {
        const blog = await Blog.findOne({ slug })
          .select('title excerpt content featuredImage author publishedAt tags');
        
        if (blog) {
          meta.title = `${blog.title} | College Forms Blog`;
          meta.description = blog.excerpt || blog.content?.substring(0, 160) + '...';
          meta.keywords = blog.tags?.join(', ') || 'college admission, education tips';
          meta.canonical = `${baseUrl}/blog/${slug}`;
          meta.ogImage = blog.featuredImage ? `${baseUrl}${blog.featuredImage}` : meta.ogImage;
          
          // Structured Data for Blog
          meta.structuredData = {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": blog.excerpt,
            "image": blog.featuredImage ? `${baseUrl}${blog.featuredImage}` : meta.ogImage,
            "datePublished": blog.publishedAt,
            "dateModified": blog.updatedAt || blog.publishedAt,
            "author": {
              "@type": "Person",
              "name": blog.author || "College Forms Team"
            },
            "publisher": {
              "@type": "Organization",
              "name": "College Forms",
              "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/logo.png`
              }
            }
          };
        }
      }
    }
    
    // ======================
    // EXAM DETAIL PAGE
    // ======================
    else if (cleanUrl.startsWith('/exam/')) {
      const slug = cleanUrl.split('/exam/')[1];
      if (slug) {
        const exam = await Exam.findOne({ slug })
          .select('name description eligibility syllabus importantDates');
        
        if (exam) {
          meta.title = `${exam.name} 2024 - Exam Date, Syllabus, Eligibility, Application Form | College Forms`;
          meta.description = `${exam.name} entrance exam details: ${exam.description?.substring(0, 140) || 'National level entrance exam'}. Check eligibility, syllabus, important dates, application process & preparation tips.`;
          meta.keywords = `${exam.name} 2024, ${exam.name} exam date, ${exam.name} syllabus, ${exam.name} application form`;
          meta.canonical = `${baseUrl}/exam/${slug}`;
        }
      }
    }
    
    // ======================
    // LISTING PAGES
    // ======================
    else if (cleanUrl === '/colleges') {
      meta.title = 'Colleges in India - Top Engineering, Medical, Arts Colleges | College Forms';
      meta.description = 'Browse 5000+ colleges in India by location, course, specialization. Find admission details, fees, cutoff ranks, placement records & apply online.';
      meta.keywords = 'engineering colleges, medical colleges, arts colleges, top colleges India, college admission 2024';
      
      meta.structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Colleges in India",
        "description": "List of top colleges in India",
        "numberOfItems": 5000,
        "itemListOrder": "https://schema.org/ItemListOrderAscending"
      };
    }
    
    else if (cleanUrl === '/courses') {
      meta.title = 'Courses in India - Engineering, Medical, Management, Arts | College Forms';
      meta.description = 'Explore 200+ courses in India: BTech, MBBS, MBA, BBA, BSc, BA, etc. Check course details, duration, fees, eligibility, scope & colleges.';
      meta.keywords = 'engineering courses, medical courses, management courses, UG courses, PG courses';
    }
    
    else if (cleanUrl === '/exams') {
      meta.title = 'Entrance Exams 2024 - JEE, NEET, CAT, UPSC, SSC | College Forms';
      meta.description = 'Complete guide to entrance exams in India: JEE Main, NEET, CAT, MAT, CLAT, UPSC, SSC. Check exam dates, syllabus, eligibility, application process.';
      meta.keywords = 'JEE Main 2024, NEET 2024, CAT 2024, entrance exams, competitive exams';
    }
    
    // ======================
    // STATIC PAGES
    // ======================
    else if (cleanUrl === '/') {
      meta.title = 'College Forms - Online College Admission & Application Forms 2024';
      meta.description = 'Apply to 1000+ colleges online. Free admission counseling for engineering, medical, management, arts courses. Get application forms, check fees, cutoff & admission process.';
      meta.keywords = 'college admission 2024, online application form, admission counseling, college search, India colleges';
      
      // Homepage Structured Data
      meta.structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "College Forms",
        "url": baseUrl,
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${baseUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      };
    }
    
    else if (cleanUrl === '/about') {
      meta.title = 'About College Forms - College Admission Assistance Platform';
      meta.description = 'College Forms helps students find & apply to colleges across India. We provide admission counseling, application assistance & college information since 2020.';
      meta.keywords = 'about us, college admission help, education portal, student assistance';
    }
    
    else if (cleanUrl === '/contact') {
      meta.title = 'Contact College Forms - Admission Queries & Support';
      meta.description = 'Contact College Forms team for admission queries, college information, application assistance, counseling services. Phone, email & live chat support.';
      meta.keywords = 'contact us, admission help, college queries, support';
      
      meta.structuredData = {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": "Contact College Forms",
        "description": "Get in touch for college admission assistance"
      };
    }
    
  } catch (error) {
    console.error('SEO Meta Tag Generation Error:', error);
    // Fallback to defaults
  }
  
  return meta;
};

// ======================
// HTML GENERATOR FOR BOTS
// ======================

const generateBotHTML = (metaTags, url) => {
  const structuredDataHTML = metaTags.structuredData 
    ? `<script type="application/ld+json">${JSON.stringify(metaTags.structuredData, null, 2)}</script>`
    : '';
  
  return `<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary Meta Tags -->
    <title>${metaTags.title}</title>
    <meta name="description" content="${metaTags.description.replace(/"/g, '&quot;')}">
    <meta name="keywords" content="${metaTags.keywords}">
    <link rel="canonical" href="${metaTags.canonical}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${metaTags.canonical}">
    <meta property="og:title" content="${metaTags.title}">
    <meta property="og:description" content="${metaTags.description.replace(/"/g, '&quot;')}">
    <meta property="og:image" content="${metaTags.ogImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="en_IN">
    <meta property="og:site_name" content="College Forms">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${metaTags.canonical}">
    <meta name="twitter:title" content="${metaTags.title}">
    <meta name="twitter:description" content="${metaTags.description.replace(/"/g, '&quot;')}">
    <meta name="twitter:image" content="${metaTags.twitterImage}">
    <meta name="twitter:site" content="@CollegeForms">
    
    <!-- SEO Meta Tags -->
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
    <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
    <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large">
    <meta name="author" content="College Forms">
    <meta name="copyright" content="Copyright © ${new Date().getFullYear()} College Forms. All rights reserved.">
    <meta name="language" content="English">
    <meta name="geo.region" content="IN">
    <meta name="geo.placename" content="India">
    <meta name="geo.position" content="20.5937;78.9629">
    <meta name="ICBM" content="20.5937, 78.9629">
    
    <!-- Mobile & PWA -->
    <meta name="theme-color" content="#2563eb">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    
    <!-- Structured Data -->
    ${structuredDataHTML}
    
    <!-- Preload & Preconnect for Performance -->
    <link rel="preconnect" href="https://www.collegeforms.in">
    <link rel="dns-prefetch" href="https://www.collegeforms.in">
    <link rel="preload" href="${metaTags.ogImage}" as="image">
    
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .seo-container {
            max-width: 1200px;
            margin: 40px auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15);
            overflow: hidden;
        }
        .seo-header {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .seo-header h1 {
            font-size: 2.5rem;
            margin-bottom: 15px;
            font-weight: 700;
        }
        .seo-header p {
            font-size: 1.2rem;
            opacity: 0.9;
            max-width: 800px;
            margin: 0 auto;
        }
        .seo-content {
            padding: 40px;
        }
        .content-section {
            margin-bottom: 30px;
            padding: 25px;
            background: #f8fafc;
            border-radius: 12px;
            border-left: 5px solid #2563eb;
        }
        .content-section h2 {
            color: #1e40af;
            margin-bottom: 15px;
            font-size: 1.5rem;
        }
        .content-section p {
            margin-bottom: 10px;
            color: #4b5563;
        }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .feature-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            text-align: center;
            transition: transform 0.3s ease;
        }
        .feature-card:hover {
            transform: translateY(-5px);
        }
        .feature-card h3 {
            color: #2563eb;
            margin-bottom: 10px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 15px 40px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            font-size: 1.1rem;
            margin-top: 20px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
        }
        .cta-button:hover {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            transform: scale(1.05);
            box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        }
        .seo-footer {
            text-align: center;
            padding: 30px;
            background: #1e293b;
            color: white;
            border-top: 5px solid #2563eb;
        }
        @media (max-width: 768px) {
            .seo-header h1 { font-size: 2rem; }
            .seo-header p { font-size: 1rem; }
            .seo-content { padding: 20px; }
            .features-grid { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>
    <div class="seo-container">
        <header class="seo-header">
            <h1>${metaTags.title}</h1>
            <p>${metaTags.description}</p>
            <a href="${metaTags.canonical}" class="cta-button">Visit Page</a>
        </header>
        
        <main class="seo-content">
            <div class="content-section">
                <h2>About College Forms</h2>
                <p>College Forms is India's leading platform for college admissions and application assistance. We help students find, compare, and apply to colleges across India with ease.</p>
                <p>Our platform provides comprehensive information about colleges, courses, admission processes, fees, cutoffs, and placement records.</p>
            </div>
            
            <div class="features-grid">
                <div class="feature-card">
                    <h3>📚 5000+ Colleges</h3>
                    <p>Extensive database of colleges across India</p>
                </div>
                <div class="feature-card">
                    <h3>🎓 200+ Courses</h3>
                    <p>Engineering, Medical, Management, Arts & more</p>
                </div>
                <div class="feature-card">
                    <h3>📝 Online Applications</h3>
                    <p>Apply to multiple colleges with single click</p>
                </div>
                <div class="feature-card">
                    <h3>🎯 Admission Counseling</h3>
                    <p>Expert guidance for college selection</p>
                </div>
            </div>
            
            <div class="content-section">
                <h2>Why Choose College Forms?</h2>
                <p>• 100% Free Platform - No hidden charges</p>
                <p>• Verified College Information</p>
                <p>• Real-time Application Tracking</p>
                <p>• Expert Admission Guidance</p>
                <p>• Scholarship Assistance</p>
                <p>• Document Verification Help</p>
            </div>
            
            <div style="text-align: center; margin-top: 40px;">
                <a href="${metaTags.canonical}" class="cta-button">Explore ${url.includes('college') ? 'College' : url.includes('course') ? 'Course' : 'Platform'}</a>
            </div>
        </main>
        
        <footer class="seo-footer">
            <p>© ${new Date().getFullYear()} College Forms. All rights reserved.</p>
            <p>Helping students achieve their academic dreams since 2020</p>
        </footer>
    </div>
    
    <!-- Bot Analytics -->
    <noscript>
        <img src="https://www.collegeforms.in/api/track/bot?page=${encodeURIComponent(url)}" 
             alt="" width="1" height="1" style="display:none;">
    </noscript>
</body>
</html>`;
};

// ======================
// MAIN SEO MIDDLEWARE
// ======================

export const seoMiddleware = async (req, res, next) => {
  const userAgent = req.get('user-agent') || '';
  const url = req.originalUrl;
  
  // Skip for non-HTML requests
  if (
    url.startsWith('/api/') ||
    url.startsWith('/uploads/') ||
    url.startsWith('/static/') ||
    url.includes('.json') ||
    url.includes('.xml') ||
    url.includes('.txt') ||
    url.includes('.ico') ||
    url.includes('.png') ||
    url.includes('.jpg') ||
    url.includes('.jpeg') ||
    url.includes('.gif') ||
    url.includes('.svg') ||
    url.includes('.css') ||
    url.includes('.js') ||
    url.includes('.webp')
  ) {
    return next();
  }
  
  // Check if it's a bot request
  if (isBotRequest(userAgent)) {
    try {
      console.log(`🤖 Bot detected: ${userAgent.substring(0, 60)} - URL: ${url}`);
      
      // Get dynamic meta tags
      const metaTags = await getDynamicMetaTags(url);
      
      // Generate SEO HTML
      const botHTML = generateBotHTML(metaTags, url);
      
      // Set headers for SEO
      res.set({
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=7200',
        'Vary': 'User-Agent',
        'X-Robots-Tag': 'index, follow',
        'X-SEO-Page': 'true'
      });
      
      return res.send(botHTML);
      
    } catch (error) {
      console.error('SEO Middleware Error:', error);
      // Fallback: serve React app
      return next();
    }
  }
  
  // Regular users: continue to React app
  next();
};