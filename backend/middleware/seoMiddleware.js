// backend/middleware/seoMiddleware.js
import College from '../models/College.js';

const getDynamicMetaTags = async (url) => {
  const baseUrl = 'https://www.collegeforms.in';
  const siteName = 'College Forms';
  const currentYear = new Date().getFullYear();
  
  // Default meta tags for homepage
  let meta = {
    title: "India's most preferred and trusted online platform for discounted College Applications | College Forms",
    description: "Explore top colleges, best courses after 12th, MBA & BBA entrance exams, and get expert college admission help. Discover scholarships, discounts on forms, and college guidance at CollegeForms.in.",
    keywords: "best colleges in India, college admission help, MBA entrance exams, course selection guidance, tuition fee discounts, scholarships after 12th, scholarships on tuition fees",
    canonical: baseUrl + url.split('?')[0],
    ogImage: `${baseUrl}/uploads/og-default.jpg`,
    twitterImage: `${baseUrl}/uploads/twitter-default.jpg`,
    robots: 'index, follow, max-image-preview:large',
    author: 'College Forms',
    publisher: 'College Forms',
    structuredData: null
  };

  try {
    const cleanUrl = url.split('?')[0]; // Remove query parameters
    
    // ======================
    // COLLEGE DETAIL PAGE - UPDATED WITH CORRECT FIELD NAMES
    // ======================
    if (cleanUrl.startsWith('/college/')) {
      const slug = cleanUrl.split('/college/')[1];
      if (slug) {
        console.log(`🔍 Fetching college data for slug: ${slug}`);
        
        // Try to find the college in database with correct field names
        let college;
        
        try {
          // Try exact slug match first
          college = await College.findOne({ slug: slug })
            .select('name location description shortDescription minFees maxFees avgPackage courses rating image coursePricing admissionProcess importantDates placementStats placementCompanies keyHighlights')
            .lean();
          
          // If not found by slug, try to find by name in URL
          if (!college) {
            // Extract college name from URL for fallback search
            const collegeNameFromUrl = slug.split('-')
              .filter(word => !['university', 'college', 'institute', 'bangalore', 'delhi', 'mumbai', 'pune', 'chennai', 'hyderabad', 'kolkata', 'ahmedabad', 'courses', 'fees', 'placements', 'admissions'].includes(word.toLowerCase()))
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
              
            if (collegeNameFromUrl) {
              college = await College.findOne({
                name: { $regex: collegeNameFromUrl, $options: 'i' }
              })
              .select('name location description shortDescription minFees maxFees avgPackage courses rating image')
              .lean();
            }
          }
        } catch (dbError) {
          console.error('Database error:', dbError);
        }
        
        if (college) {
          console.log(`✅ Found college: ${college.name}`);
          
          // Extract location parts (city, state)
          let city = 'India';
          let state = 'India';
          if (college.location) {
            const locationParts = college.location.split(',');
            city = locationParts[0]?.trim() || 'India';
            state = locationParts[1]?.trim() || 'India';
          }
          
          // Extract course names
          let courseNames = 'Various Courses';
          if (college.courses && college.courses.length > 0) {
            courseNames = college.courses.slice(0, 5).join(', ');
          }
          
          // Generate dynamic title - CORRECTED
          meta.title = `${college.name} - Courses, Fees ${currentYear}, Placements, Admissions | College Forms`;
          
          // Generate dynamic description
          const feeRange = college.minFees && college.maxFees ? 
            `Fees range from ₹${college.minFees.toLocaleString()} to ₹${college.maxFees.toLocaleString()}` : 
            'Affordable fee structure';
            
          const placementInfo = college.avgPackage ? 
            `with average placement package of ₹${college.avgPackage.toLocaleString()} LPA` : 
            'with excellent placement records';
          
          meta.description = `${college.name} located in ${college.location}. Explore ${courseNames.toLowerCase()} courses, ${feeRange}, ${placementInfo}. Get complete admission guidance, important dates, required documents, and application process for ${currentYear}.`;
          
          // Generate keywords
          meta.keywords = `${college.name}, ${college.name} courses, ${college.name} fees ${currentYear}, ${college.name} placements, ${college.name} admission ${currentYear}, ${city} colleges, best colleges in ${state}, college admission help, discounted college forms`;
          
          // CORRECT canonical URL - specific to this college page
          meta.canonical = `${baseUrl}/college/${slug}`;
          
          // Robots tag
          meta.robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
          
          // Author and Publisher
          meta.author = 'College Forms';
          meta.publisher = 'College Forms';
          
          // Images
          meta.ogImage = college.image ? `${baseUrl}${college.image}` : `${baseUrl}/uploads/college-default.jpg`;
          meta.twitterImage = college.image ? `${baseUrl}${college.image}` : `${baseUrl}/uploads/twitter-default.jpg`;
          
          // Structured Data for College - UPDATED WITH CORRECT FIELDS
          const structuredData = {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": college.name,
            "description": college.shortDescription || college.description?.substring(0, 200) || `Information about ${college.name} college`,
            "url": `${baseUrl}/college/${slug}`,
            "logo": college.image ? `${baseUrl}${college.image}` : `${baseUrl}/logo.png`,
            "image": college.image ? `${baseUrl}${college.image}` : `${baseUrl}/uploads/college-default.jpg`,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": city,
              "addressRegion": state,
              "addressCountry": "IN"
            },
            "aggregateRating": college.rating ? {
              "@type": "AggregateRating",
              "ratingValue": college.rating,
              "ratingCount": 100,
              "bestRating": "5",
              "worstRating": "1"
            } : undefined
          };
          
          // Add offers if fee information exists
          if (college.minFees) {
            structuredData.offers = {
              "@type": "Offer",
              "price": college.minFees,
              "priceCurrency": "INR",
              "availability": "https://schema.org/InStock",
              "description": "Annual tuition fees"
            };
          }
          
          // Add course information
          if (college.courses && college.courses.length > 0) {
            structuredData.course = college.courses.map(course => ({
              "@type": "Course",
              "name": course,
              "description": `${course} course at ${college.name}`,
              "provider": {
                "@type": "Organization",
                "name": college.name
              }
            }));
          }
          
          meta.structuredData = structuredData;
          
        } else {
          // College not found in DB - Generate dynamic content from URL
          console.log(`❌ College not found in DB for slug: ${slug}`);
          
          // Parse college name from URL
          const urlParts = slug.split('-');
          const collegeName = urlParts
            .filter(part => !['university', 'college', 'institute', 'bangalore', 'delhi', 'mumbai', 'pune', 'chennai', 'hyderabad', 'kolkata', 'ahmedabad', 'courses', 'fees', 'placements', 'admissions'].includes(part.toLowerCase()))
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');
          
          const location = urlParts.includes('bangalore') ? 'Bangalore, Karnataka' : 
                          urlParts.includes('delhi') ? 'Delhi' : 
                          urlParts.includes('mumbai') ? 'Mumbai, Maharashtra' : 
                          'India';
          
          // For example: christ-university-bangalore-courses-fees-placements-admissions-bangalore
          meta.title = `${collegeName} - Courses, Fees ${currentYear}, Placements, Admissions | College Forms`;
          meta.description = `${collegeName} in ${location}. Explore courses, fee structure ${currentYear}, placement records, admission process, scholarships, and application forms. Get expert admission guidance and exclusive discounts at College Forms.`;
          meta.keywords = `${collegeName}, ${collegeName} courses, ${collegeName} fees, ${collegeName} admission, ${location.split(',')[0]} colleges, college admission help, discounted application forms`;
          meta.canonical = `${baseUrl}/college/${slug}`;
          meta.robots = 'index, follow, max-image-preview:large';
          meta.author = 'College Forms';
          meta.publisher = 'College Forms';
          
          // Generate structured data even for not-found colleges
          meta.structuredData = {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": collegeName,
            "description": `Information about ${collegeName} college in ${location}`,
            "url": `${baseUrl}/college/${slug}`,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": location.split(',')[0],
              "addressRegion": location.split(',')[1] || location,
              "addressCountry": "IN"
            }
          };
        }
      }
    }
    
    // ======================
    // HOMEPAGE
    // ======================
    else if (cleanUrl === '/' || cleanUrl === '') {
      meta.title = "India's most preferred and trusted online platform for discounted College Applications | College Forms";
      meta.description = "Explore top colleges, best courses after 12th, MBA & BBA entrance exams, and get expert college admission help. Discover scholarships, discounts on forms, and college guidance at CollegeForms.in.";
      meta.keywords = "best colleges in India, college admission help, MBA entrance exams, course selection guidance, tuition fee discounts, scholarships after 12th, scholarships on tuition fees";
      meta.canonical = baseUrl;
      meta.robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
      meta.author = 'College Forms';
      meta.publisher = 'College Forms';
      
      // Homepage Structured Data
      meta.structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "College Forms",
        "url": baseUrl,
        "description": "India's most preferred online platform for discounted college applications",
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${baseUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      };
    }
    
    // ======================
    // OTHER PAGES
    // ======================
    else if (cleanUrl === '/colleges') {
      meta.title = `Best Colleges in India ${currentYear} - Top Engineering, Medical, Management Colleges | College Forms`;
      meta.description = `Find and compare the best colleges in India for ${currentYear}. Explore top engineering, medical, management, arts colleges with fee structure, placement records, admission process, and exclusive discounts.`;
      meta.keywords = `best colleges in India ${currentYear}, top engineering colleges, medical colleges India, management colleges, college comparison, college fees`;
      meta.canonical = `${baseUrl}/colleges`;
    }
    
    else if (cleanUrl === '/courses') {
      meta.title = `Best Courses after 12th ${currentYear} - Engineering, Medical, Arts, Commerce | College Forms`;
      meta.description = `Explore the best courses after 12th for ${currentYear}. Get complete information about engineering, medical, arts, commerce, management courses with career scope, eligibility, and college options.`;
      meta.keywords = `best courses after 12th ${currentYear}, engineering courses, medical courses, arts courses, career guidance, course selection`;
      meta.canonical = `${baseUrl}/courses`;
    }
    
  } catch (error) {
    console.error('SEO Meta Tag Generation Error:', error);
    // Keep default values
  }
  
  return meta;
};

// Update the generateBotHTML function to include ALL meta tags
const generateBotHTML = (metaTags) => {
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
    
    <!-- Robots -->
    <meta name="robots" content="${metaTags.robots}">
    <meta name="googlebot" content="${metaTags.robots}">
    <meta name="bingbot" content="${metaTags.robots}">
    
    <!-- Author & Publisher -->
    <meta name="author" content="${metaTags.author}">
    <meta name="publisher" content="${metaTags.publisher}">
    <meta name="copyright" content="Copyright © ${new Date().getFullYear()} College Forms. All rights reserved.">
    
    <!-- Language -->
    <meta name="language" content="en">
    <meta property="og:locale" content="en_IN">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${metaTags.canonical}">
    <meta property="og:title" content="${metaTags.title}">
    <meta property="og:description" content="${metaTags.description.replace(/"/g, '&quot;')}">
    <meta property="og:image" content="${metaTags.ogImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="College Forms">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${metaTags.canonical}">
    <meta name="twitter:title" content="${metaTags.title}">
    <meta name="twitter:description" content="${metaTags.description.replace(/"/g, '&quot;')}">
    <meta name="twitter:image" content="${metaTags.twitterImage}">
    <meta name="twitter:site" content="@CollegeForms">
    <meta name="twitter:creator" content="@CollegeForms">
    
    <!-- Additional SEO Tags -->
    <meta name="geo.region" content="IN">
    <meta name="geo.placename" content="India">
    <meta name="ICBM" content="20.5937, 78.9629">
    
    <!-- Mobile & PWA -->
    <meta name="theme-color" content="#2563eb">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="mobile-web-app-capable" content="yes">
    
    <!-- Structured Data -->
    ${structuredDataHTML}
    
    <style>
        /* SEO-optimized content for bots */
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            margin: 0;
            padding: 20px;
            background: #f8fafc;
        }
        .seo-container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        h1 {
            color: #1e40af;
            font-size: 2.5rem;
            margin-bottom: 20px;
            border-bottom: 3px solid #2563eb;
            padding-bottom: 15px;
        }
        h2 {
            color: #1e40af;
            font-size: 1.8rem;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        h3 {
            color: #374151;
            font-size: 1.4rem;
            margin-top: 25px;
            margin-bottom: 10px;
        }
        p {
            margin-bottom: 15px;
            font-size: 1.1rem;
            color: #4b5563;
        }
        .highlight-box {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
            border-left: 5px solid #2563eb;
            padding: 20px;
            margin: 25px 0;
            border-radius: 8px;
        }
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .feature-card {
            background: #f8fafc;
            padding: 20px;
            border-radius: 10px;
            border: 1px solid #e5e7eb;
            text-align: center;
        }
        .feature-card h4 {
            color: #2563eb;
            margin-bottom: 10px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 15px 30px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            margin-top: 20px;
            border: none;
            cursor: pointer;
            font-size: 1.1rem;
        }
        .cta-button:hover {
            background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
        }
        .content-list {
            margin: 20px 0;
            padding-left: 20px;
        }
        .content-list li {
            margin-bottom: 10px;
            color: #4b5563;
        }
        @media (max-width: 768px) {
            .seo-container {
                padding: 20px;
            }
            h1 {
                font-size: 2rem;
            }
            h2 {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="seo-container">
        <h1>${metaTags.title}</h1>
        <p>${metaTags.description}</p>
        
        <div class="highlight-box">
            <h2>Why Choose College Forms?</h2>
            <p>College Forms is India's most trusted platform for college admissions, offering exclusive discounts on application forms, expert admission guidance, and comprehensive college information.</p>
        </div>
        
        <h2>Key Features</h2>
        <div class="features-grid">
            <div class="feature-card">
                <h4>🎓 5000+ Colleges</h4>
                <p>Extensive database of colleges across India with verified information</p>
            </div>
            <div class="feature-card">
                <h4>💰 Exclusive Discounts</h4>
                <p>Get special discounts on college application forms and scholarships</p>
            </div>
            <div class="feature-card">
                <h4>📝 Easy Applications</h4>
                <p>Apply to multiple colleges with single click application process</p>
            </div>
            <div class="feature-card">
                <h4>🎯 Expert Guidance</h4>
                <p>Professional admission counseling and career guidance</p>
            </div>
        </div>
        
        <h2>Comprehensive College Information</h2>
        <ul class="content-list">
            <li>Complete fee structure and scholarship details</li>
            <li>Admission process and important dates</li>
            <li>Placement records and company information</li>
            <li>Course details and eligibility criteria</li>
            <li>Campus facilities and infrastructure</li>
            <li>Faculty information and accreditation details</li>
        </ul>
        
        <h2>Admission Assistance</h2>
        <p>Our team of admission experts helps you with:</p>
        <ul class="content-list">
            <li>College selection based on your profile</li>
            <li>Application form filling assistance</li>
            <li>Document preparation and verification</li>
            <li>Entrance exam guidance</li>
            <li>Scholarship application support</li>
            <li>Admission interview preparation</li>
        </ul>
        
        <div style="text-align: center; margin-top: 40px;">
            <a href="${metaTags.canonical}" class="cta-button">Visit College Forms for Complete Details</a>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p><strong>About College Forms:</strong> College Forms is India's leading platform for college admissions, trusted by thousands of students for authentic information, exclusive discounts, and expert guidance.</p>
            <p><strong>Contact:</strong> For admission queries, call us at +91-XXXXXXXXXX or email at support@collegeforms.in</p>
        </div>
    </div>
</body>
</html>`;
};

// Add this at the VERY END of seoMiddleware.js
export const seoMiddleware = async (req, res, next) => {
  const userAgent = req.get('user-agent') || '';
  const url = req.originalUrl;
  
  console.log(`🔍 SEO Middleware checking: ${url}`);
  
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
    url.includes('.js')
  ) {
    return next();
  }
  
  // Bot detection
  const isBot = (ua) => {
    if (!ua) return false;
    const lowerUA = ua.toLowerCase();
    const bots = ['googlebot', 'bingbot', 'slurp', 'facebookexternalhit', 'twitterbot'];
    return bots.some(bot => lowerUA.includes(bot));
  };
  
  // Check if it's a bot request
  if (isBot(userAgent)) {
    console.log(`🤖 Bot detected: ${userAgent.substring(0, 50)}`);
    
    try {
      // Get dynamic meta tags
      const metaTags = await getDynamicMetaTags(url);
      
      // Generate HTML for bots
      const botHTML = generateBotHTML(metaTags);
      
      // Set headers
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      
      console.log(`✅ Serving SEO HTML for: ${url}`);
      return res.send(botHTML);
      
    } catch (error) {
      console.error('SEO Middleware Error:', error);
      // Fallback: serve React app
      return next();
    }
  }
  
  // Regular users: continue to React app
  console.log(`👤 Regular user, passing to React: ${url}`);
  next();
};