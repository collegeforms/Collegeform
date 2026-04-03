// backend/middleware/seoMiddleware.js
import College from '../models/College.js';
import Blog from '../models/Blog.js';

// Helper function to normalize URLs
const normalizeUrl = (url) => {
  // Remove query parameters
  let cleanUrl = url.split('?')[0];
  
  // Remove tracking parameters from the URL for canonical
  const canonicalUrl = cleanUrl.replace(/(\?|&)(utm_|ref|source|medium|campaign|term|content|fbclid|gclid|msclkid)=[^&]*/g, '');
  
  // Ensure trailing slash for consistency (except for files with extensions)
  if (!canonicalUrl.endsWith('/') && !canonicalUrl.includes('.') && canonicalUrl !== '') {
    return canonicalUrl + '/';
  }
  
  return canonicalUrl;
};

const getDynamicMetaTags = async (url) => {
  const baseUrl = 'https://www.collegeforms.in';
  const siteName = 'College Forms';
  const currentYear = new Date().getFullYear();
  
  // Normalize URL first
  const normalizedUrl = normalizeUrl(url);
  
  // Default meta tags for homepage
  let meta = {
    title: "India's most preferred and trusted online platform for discounted College Applications | College Forms",
    description: "Explore top colleges, best courses after 12th, MBA & BBA entrance exams, and get expert college admission help. Discover scholarships, discounts on forms, and college guidance at CollegeForms.in.",
    keywords: "best colleges in India, college admission help, MBA entrance exams, course selection guidance, tuition fee discounts, scholarships after 12th, scholarships on tuition fees",
    canonical: baseUrl + normalizedUrl,
    ogImage: `${baseUrl}/uploads/og-default.jpg`,
    twitterImage: `${baseUrl}/uploads/twitter-default.jpg`,
    robots: 'index, follow, max-image-preview:large',
    author: 'College Forms',
    publisher: 'College Forms',
    structuredData: null,
    hreflangs: [],
    linkTags: []
  };

  try {
    const cleanUrl = normalizedUrl.replace(/\/$/, ''); // Remove trailing slash for matching
    
    // ======================
    // HOMEPAGE & ALIASES
    // ======================
    if (cleanUrl === '' || cleanUrl === '/' || cleanUrl === '/home' || cleanUrl === '/index') {
      meta.title = "India's most preferred and trusted online platform for discounted College Applications | College Forms";
      meta.description = "Explore top colleges, best courses after 12th, MBA & BBA entrance exams, and get expert college admission help. Discover scholarships, discounts on forms, and college guidance at CollegeForms.in.";
      meta.keywords = "best colleges in India, college admission help, MBA entrance exams, course selection guidance, tuition fee discounts, scholarships after 12th, scholarships on tuition fees";
      meta.canonical = `${baseUrl}/`;
      meta.robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
      
      // Structured Data for Homepage
      meta.structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "College Forms",
        "url": baseUrl,
        "description": "India's most trusted platform for college admissions with exclusive discounts",
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${baseUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      };
    }
    
    // ======================
    // COLLEGE DETAIL PAGE
    // ======================
    else if (cleanUrl.startsWith('/college/')) {
      let slug = cleanUrl.split('/college/')[1];
      slug = slug.replace(/\/$/, ''); // Remove trailing slash
      
      if (slug) {
        console.log(`🔍 Fetching college data for slug: ${slug}`);
        
        let college;
        
        try {
          college = await College.findOne({ slug: slug })
            .select('name location description shortDescription minFees maxFees avgPackage courses rating image coursePricing admissionProcess importantDates placementStats placementCompanies keyHighlights')
            .lean();
          
          if (!college) {
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
          
          let city = 'India';
          let state = 'India';
          if (college.location) {
            const locationParts = college.location.split(',');
            city = locationParts[0]?.trim() || 'India';
            state = locationParts[1]?.trim() || 'India';
          }
          
          let courseNames = 'Various Courses';
          if (college.courses && college.courses.length > 0) {
            courseNames = college.courses.slice(0, 5).join(', ');
          }
          
          meta.title = `${college.name} - Courses, Fees ${currentYear}, Placements, Admissions | College Forms`;
          
          const feeRange = college.minFees && college.maxFees ? 
            `Fees range from ₹${college.minFees.toLocaleString()} to ₹${college.maxFees.toLocaleString()}` : 
            'Affordable fee structure';
            
          const placementInfo = college.avgPackage ? 
            `with average placement package of ₹${college.avgPackage.toLocaleString()} LPA` : 
            'with excellent placement records';
          
          meta.description = `${college.name} located in ${college.location}. Explore ${courseNames.toLowerCase()} courses, ${feeRange}, ${placementInfo}. Get complete admission guidance, important dates, required documents, and application process for ${currentYear}.`;
          
          meta.keywords = `${college.name}, ${college.name} courses, ${college.name} fees ${currentYear}, ${college.name} placements, ${college.name} admission ${currentYear}, ${city} colleges, best colleges in ${state}, college admission help, discounted college forms`;
          
          meta.canonical = `${baseUrl}/college/${slug}/`;
          meta.robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
          meta.ogImage = college.image ? `${baseUrl}${college.image}` : `${baseUrl}/uploads/college-default.jpg`;
          meta.twitterImage = college.image ? `${baseUrl}${college.image}` : `${baseUrl}/uploads/twitter-default.jpg`;
          
          // Structured Data for College
          meta.structuredData = {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": college.name,
            "description": college.shortDescription || college.description?.substring(0, 200) || `Information about ${college.name} college`,
            "url": `${baseUrl}/college/${slug}/`,
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
          
          if (college.minFees) {
            meta.structuredData.offers = {
              "@type": "Offer",
              "price": college.minFees,
              "priceCurrency": "INR",
              "availability": "https://schema.org/InStock",
              "description": "Annual tuition fees"
            };
          }
          
          if (college.courses && college.courses.length > 0) {
            meta.structuredData.course = college.courses.map(course => ({
              "@type": "Course",
              "name": course,
              "description": `${course} course at ${college.name}`,
              "provider": {
                "@type": "Organization",
                "name": college.name
              }
            }));
          }
          
        } else {
          console.log(`❌ College not found in DB for slug: ${slug}`);
          
          const urlParts = slug.split('-');
          const collegeName = urlParts
            .filter(part => !['university', 'college', 'institute', 'bangalore', 'delhi', 'mumbai', 'pune', 'chennai', 'hyderabad', 'kolkata', 'ahmedabad', 'courses', 'fees', 'placements', 'admissions'].includes(part.toLowerCase()))
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');
          
          const location = urlParts.includes('bangalore') ? 'Bangalore, Karnataka' : 
                          urlParts.includes('delhi') ? 'Delhi' : 
                          urlParts.includes('mumbai') ? 'Mumbai, Maharashtra' : 
                          urlParts.includes('sonipat') || urlParts.includes('haryana') ? 'Sonipat, Haryana' :
                          'India';
          
          meta.title = `${collegeName} - Courses, Fees ${currentYear}, Placements, Admissions | College Forms`;
          meta.description = `${collegeName} in ${location}. Explore courses, fee structure ${currentYear}, placement records, admission process, scholarships, and application forms. Get expert admission guidance and exclusive discounts at College Forms.`;
          meta.keywords = `${collegeName}, ${collegeName} courses, ${collegeName} fees, ${collegeName} admission, ${location.split(',')[0]} colleges, college admission help, discounted application forms`;
          meta.canonical = `${baseUrl}/college/${slug}/`;
          meta.robots = 'index, follow, max-image-preview:large';
          
          meta.structuredData = {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": collegeName,
            "description": `Information about ${collegeName} college in ${location}`,
            "url": `${baseUrl}/college/${slug}/`,
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
    // COLLEGES LISTING PAGE
    // ======================
    else if (cleanUrl === '/colleges') {
      meta.title = `Best Colleges in India ${currentYear} - Top Engineering, Medical, Management Colleges | College Forms`;
      meta.description = `Find and compare the best colleges in India for ${currentYear}. Explore top engineering, medical, management, arts colleges with fee structure, placement records, admission process, and exclusive discounts.`;
      meta.keywords = `best colleges in India ${currentYear}, top engineering colleges, medical colleges India, management colleges, college comparison, college fees, college admission`;
      meta.canonical = `${baseUrl}/colleges/`;
      meta.robots = 'index, follow, max-image-preview:large';
    }
    
    // ======================
    // STEP BY STEP GUIDANCE PAGE
    // ======================
    else if (cleanUrl === '/step') {
      meta.title = `Step-by-Step College Admission Guide ${currentYear} | College Forms`;
      meta.description = `Complete step-by-step guide for college admissions. Learn how to choose the right college, prepare documents, apply online, and secure admission with expert guidance from College Forms.`;
      meta.keywords = `college admission guide, step by step admission, admission process, document preparation, college application steps`;
      meta.canonical = `${baseUrl}/step/`;
      meta.robots = 'index, follow, max-image-preview:large';
    }
    
    // ======================
    // OFFERS & DISCOUNTS PAGE
    // ======================
    else if (cleanUrl === '/offer') {
      meta.title = `Exclusive Offers & Discounts on College Applications ${currentYear} | College Forms`;
      meta.description = `Get exclusive discounts and special offers on college application forms. Save money on admission fees with our limited-time offers for engineering, medical, management colleges.`;
      meta.keywords = `college application discounts, exclusive offers, admission fee discounts, special offers, save on college applications`;
      meta.canonical = `${baseUrl}/offer/`;
      meta.robots = 'index, follow, max-image-preview:large';
    }
    
    // ======================
    // EDUCATION LOAN PAGE
    // ======================
    else if (cleanUrl === '/education/education-loan') {
      meta.title = `Education Loan for College Studies - Complete Guide ${currentYear} | College Forms`;
      meta.description = `Get complete information about education loans for college studies. Compare interest rates, eligibility criteria, documents required, and apply for education loan with expert guidance.`;
      meta.keywords = `education loan, student loan, college education loan, loan for studies, education finance`;
      meta.canonical = `${baseUrl}/education/education-loan/`;
      meta.robots = 'index, follow, max-image-preview:large';
    }
    
    // ======================
    // ACCOMMODATION PAGE
    // ======================
    else if (cleanUrl === '/education/accommodation') {
      meta.title = `College Accommodation & Hostel Facilities ${currentYear} | College Forms`;
      meta.description = `Find college accommodation, hostel facilities, PG options near colleges. Get information on room types, fees, facilities, and book your stay with verified accommodation partners.`;
      meta.keywords = `college accommodation, hostel facilities, student hostel, PG near college, college hostel, accommodation for students`;
      meta.canonical = `${baseUrl}/education/accommodation/`;
      meta.robots = 'index, follow, max-image-preview:large';
    }
    
    // ======================
    // COMPETITIVE EXAMS PAGE
    // ======================
    else if (cleanUrl === '/competitiveexams' || cleanUrl === '/CompetitiveExams') {
      meta.title = `Competitive Exams for College Admissions ${currentYear} - JEE, NEET, CAT | College Forms`;
      meta.description = `Prepare for competitive exams like JEE, NEET, CAT, CLAT, and more. Get exam patterns, syllabus, preparation tips, and college admission guidance based on exam scores.`;
      meta.keywords = `competitive exams, JEE preparation, NEET exam, CAT exam, entrance exams, exam preparation`;
      meta.canonical = `${baseUrl}/competitiveexams/`;
      meta.robots = 'index, follow, max-image-preview:large';
    }
    
    // ======================
    // STUDY ABROAD PAGE
    // ======================
    else if (cleanUrl === '/studyabroad') {
      meta.title = `Study Abroad Programs & International Colleges ${currentYear} | College Forms`;
      meta.description = `Explore study abroad opportunities in USA, UK, Canada, Australia, and other countries. Get guidance on admission process, visas, scholarships for international education.`;
      meta.keywords = `study abroad, international education, foreign universities, overseas education, study in USA, study in UK`;
      meta.canonical = `${baseUrl}/studyabroad/`;
      meta.robots = 'index, follow, max-image-preview:large';
    }
    
    // ======================
    // STUDENT TESTS PAGE
    // ======================
    else if (cleanUrl === '/students/tests') {
      meta.title = `Online Tests & Practice Papers for College Admissions ${currentYear} | College Forms`;
      meta.description = `Take free online tests and practice papers for college entrance exams. Get instant results, performance analysis, and personalized preparation guidance.`;
      meta.keywords = `online tests, practice papers, mock tests, entrance exam practice, test preparation`;
      meta.canonical = `${baseUrl}/students/tests/`;
      meta.robots = 'index, follow, max-image-preview:large';
    }
    
    // ======================
    // BLOG PAGES
    // ======================
    else if (cleanUrl.startsWith('/blogs')) {
      // Blog listing page (/blogs)
      if (cleanUrl === '/blogs' || cleanUrl === '/blogs/' || cleanUrl === '/blogs/index') {
        meta.title = `College Admission Blogs & Articles ${currentYear} - Expert Guidance | College Forms`;
        meta.description = `Read expert articles on college admissions, entrance exams, career guidance, and study tips. Get the latest updates on admissions, scholarships, and educational trends at College Forms.`;
        meta.keywords = `college admission blogs, education articles, study tips, entrance exam preparation, career guidance, admission tips, college guidance blogs`;
        meta.canonical = `${baseUrl}/blogs/`;  // ENSURE trailing slash
        meta.robots = 'index, follow, max-image-preview:large';
        meta.author = 'College Forms';
        meta.publisher = 'College Forms';
        meta.ogImage = `${baseUrl}/uploads/blog-listing-default.jpg`;
        meta.twitterImage = `${baseUrl}/uploads/blog-listing-default.jpg`;
        
        // Add explicit link tags for blog listing
        meta.linkTags = [
          { rel: 'canonical', href: `${baseUrl}/blogs/` },
          { rel: 'alternate', hreflang: 'x-default', href: `${baseUrl}/blogs/` },
          { rel: 'alternate', hreflang: 'en-in', href: `${baseUrl}/blogs/` }
        ];
        
        // Structured Data for Blog Listing
        meta.structuredData = {
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "College Forms Education Blog",
          "description": "Expert articles on college admissions, entrance exams, career guidance, and educational trends",
          "url": `${baseUrl}/blogs/`,
          "publisher": {
            "@type": "Organization",
            "name": "College Forms",
            "logo": {
              "@type": "ImageObject",
              "url": `${baseUrl}/logo.png`,
              "width": 200,
              "height": 60
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${baseUrl}/blogs/`
          }
        };
      } 
      // Individual blog post (/blogs/slug-here)
      else if (cleanUrl.startsWith('/blogs/')) {
        let slug = cleanUrl.split('/blogs/')[1];
        slug = slug.replace(/\/$/, ''); // Remove trailing slash
        
        if (slug && slug !== '') {
          console.log(`🔍 Fetching blog data for slug: ${slug}`);
          
          try {
            const blog = await Blog.findOne({ slug: slug })
              .select('title content excerpt image author category createdAt updatedAt faqs')
              .lean();
            
            if (blog) {
              console.log(`✅ Found blog: ${blog.title}`);
              
              // Extract excerpt from content if no excerpt provided
              const blogExcerpt = blog.excerpt || 
                blog.content.substring(0, 200)
                  .replace(/<[^>]*>/g, '')
                  .replace(/\s+/g, ' ')
                  .trim() + '...';
              
              meta.title = `${blog.title} | College Forms Blog`;
              meta.description = blogExcerpt;
              meta.keywords = `${blog.category}, ${blog.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, ' ')}, college admission tips, education blog, study tips`;
              meta.canonical = `${baseUrl}/blogs/${slug}/`;
              meta.robots = 'index, follow, max-image-preview:large';
              meta.author = blog.author;
              meta.publisher = 'College Forms';
              meta.ogImage = blog.image ? `${baseUrl}${blog.image}` : `${baseUrl}/uploads/blog-default.jpg`;
              meta.twitterImage = blog.image ? `${baseUrl}${blog.image}` : `${baseUrl}/uploads/blog-default.jpg`;
              
              // Structured Data for Blog Post
              const datePublished = new Date(blog.createdAt).toISOString();
              const dateModified = new Date(blog.updatedAt || blog.createdAt).toISOString();
              
              meta.structuredData = {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": blog.title,
                "description": blogExcerpt,
                "image": blog.image ? `${baseUrl}${blog.image}` : `${baseUrl}/uploads/blog-default.jpg`,
                "datePublished": datePublished,
                "dateModified": dateModified,
                "author": {
                  "@type": "Person",
                  "name": blog.author
                },
                "publisher": {
                  "@type": "Organization",
                  "name": "College Forms",
                  "logo": {
                    "@type": "ImageObject",
                    "url": `${baseUrl}/logo.png`,
                    "width": 200,
                    "height": 60
                  }
                },
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": `${baseUrl}/blogs/${slug}/`
                }
              };
              
              // Add FAQ structured data if available
              if (blog.faqs && blog.faqs.length > 0) {
                meta.structuredData.mainEntity = {
                  "@type": "FAQPage",
                  "mainEntity": blog.faqs.map(faq => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": faq.answer
                    }
                  }))
                };
              }
              
            } else {
              // Blog not found - generate from URL
              console.log(`❌ Blog not found for slug: ${slug}`);
              
              const blogTitle = slug.split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
              
              meta.title = `${blogTitle} - College Admission Blog | College Forms`;
              meta.description = `Read about ${blogTitle.toLowerCase()} on College Forms blog. Get expert insights and tips for college admissions, entrance exams, and career guidance.`;
              meta.keywords = `${blogTitle.toLowerCase()}, college admission blog, education article, study tips, career guidance`;
              meta.canonical = `${baseUrl}/blogs/${slug}/`;
              meta.robots = 'index, follow, max-image-preview:large';
              meta.author = 'College Forms';
              meta.publisher = 'College Forms';
              
              meta.structuredData = {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": blogTitle,
                "description": `Article about ${blogTitle} on College Forms blog`,
                "datePublished": new Date().toISOString(),
                "author": {
                  "@type": "Person",
                  "name": "College Forms"
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
          } catch (error) {
            console.error('Error fetching blog:', error);
          }
        }
      }
    }
    
    // ======================
    // EVENTS PAGE
    // ======================
    else if (cleanUrl === '/events') {
      meta.title = `College Admission Events & Webinars ${currentYear} | College Forms`;
      meta.description = `Join free college admission events, webinars, and counseling sessions. Meet admission experts, get application guidance, and discover scholarship opportunities.`;
      meta.keywords = `college admission events, admission webinars, free counseling, education events, college guidance sessions`;
      meta.canonical = `${baseUrl}/events/`;
      meta.robots = 'index, follow, max-image-preview:large';
    }
    
    // ======================
    // CONTACT US PAGE
    // ======================
    else if (cleanUrl === '/contactus' || cleanUrl === '/contact') {
      meta.title = `Contact College Forms - Get Admission Help & Support ${currentYear} | College Forms`;
      meta.description = `Get in touch with College Forms for admission guidance, application help, scholarship information, and college selection support. Our experts are here to help you.`;
      meta.keywords = `contact college forms, admission help, college guidance support, application assistance, admission counseling`;
      meta.canonical = `${baseUrl}/contactus/`;
      meta.robots = 'index, follow, max-image-preview:large';
    }
    
    // ======================
    // PRIVACY POLICY PAGE
    // ======================
    else if (cleanUrl === '/privacy') {
      meta.title = `Privacy Policy - College Forms | Your Data Protection`;
      meta.description = `Read College Forms privacy policy to understand how we protect your personal information and ensure data security during the college admission process.`;
      meta.keywords = `privacy policy, data protection, privacy terms, college forms privacy`;
      meta.canonical = `${baseUrl}/privacy/`;
      meta.robots = 'index, follow';
    }
    
    // ======================
    // TERMS & CONDITIONS PAGE
    // ======================
    else if (cleanUrl === '/terms') {
      meta.title = `Terms & Conditions - College Forms | Platform Usage Terms`;
      meta.description = `Read College Forms terms and conditions for using our platform, services, and understanding your rights and responsibilities during college admissions.`;
      meta.keywords = `terms and conditions, usage terms, platform terms, college forms terms`;
      meta.canonical = `${baseUrl}/terms/`;
      meta.robots = 'index, follow';
    }
    
    // ======================
    // OVERSEAS EDUCATION PAGE
    // ======================
    else if (cleanUrl === '/education/overseas') {
      meta.title = `Overseas Education & Study Abroad Guidance ${currentYear} | College Forms`;
      meta.description = `Get complete guidance for overseas education including country selection, university admission, visa process, scholarships, and pre-departure preparations.`;
      meta.keywords = `overseas education, study abroad guidance, international studies, foreign education, study overseas`;
      meta.canonical = `${baseUrl}/education/overseas/`;
      meta.robots = 'index, follow, max-image-preview:large';
    }
    
    // ======================
    // ENGINEERING EDUCATION PAGE
    // ======================
    else if (cleanUrl === '/education/engineering') {
      meta.title = `Engineering Colleges & Courses ${currentYear} - Top B.Tech Programs | College Forms`;
      meta.description = `Explore top engineering colleges, B.Tech programs, admission process, and placement records. Get complete guidance for engineering admissions in India.`;
      meta.keywords = `engineering colleges, B.Tech programs, engineering courses, engineering admission, top engineering colleges`;
      meta.canonical = `${baseUrl}/education/engineering/`;
      meta.robots = 'index, follow, max-image-preview:large';
    }
    
    // ======================
    // COURSES PAGE (for backward compatibility)
    // ======================
    else if (cleanUrl === '/courses') {
      meta.title = `Best Courses after 12th ${currentYear} - Engineering, Medical, Arts, Commerce | College Forms`;
      meta.description = `Explore the best courses after 12th for ${currentYear}. Get complete information about engineering, medical, arts, commerce, management courses with career scope, eligibility, and college options.`;
      meta.keywords = `best courses after 12th ${currentYear}, engineering courses, medical courses, arts courses, career guidance, course selection`;
      meta.canonical = `${baseUrl}/courses/`;
      meta.robots = 'index, follow, max-image-preview:large';
    }
    
    // ======================
    // ABOUT PAGE (for backward compatibility)
    // ======================
    else if (cleanUrl === '/about') {
      meta.title = `About College Forms - India's Trusted College Admission Platform`;
      meta.description = `Learn about College Forms - India's most preferred platform for discounted college applications, expert admission guidance, and comprehensive college information.`;
      meta.keywords = `about college forms, college admission platform, discounted applications, admission guidance`;
      meta.canonical = `${baseUrl}/about/`;
      meta.robots = 'index, follow, max-image-preview:large';
    }
    
    // Add hreflang tags
    meta.hreflangs = [
      { lang: 'x-default', url: meta.canonical },
      { lang: 'en-in', url: meta.canonical }
    ];
    
  } catch (error) {
    console.error('SEO Meta Tag Generation Error:', error);
  }
  
  return meta;
};

// Generate SEO-optimized HTML for bots
const generateBotHTML = (metaTags, url) => {
  const structuredDataHTML = metaTags.structuredData 
    ? `<script type="application/ld+json">${JSON.stringify(metaTags.structuredData, null, 2)}</script>`
    : '';
  
  // Generate hreflang tags
  const hreflangTags = metaTags.hreflangs.map(h => 
    `<link rel="alternate" href="${h.url}" hreflang="${h.lang}" />`
  ).join('\n    ');
  
  // Generate additional link tags
  const linkTags = metaTags.linkTags ? metaTags.linkTags.map(link => 
    `<link rel="${link.rel}" href="${link.href}" ${link.hreflang ? `hreflang="${link.hreflang}"` : ''} />`
  ).join('\n    ') : '';
  
  // Determine page type
  const isBlogPage = url.includes('/blogs/') && url !== '/blogs/' && url !== '/blogs';
  const isBlogList = url === '/blogs' || url === '/blogs/';
  const isCollegePage = url.includes('/college/');
  
  // Determine specific page type for custom content
  let pageType = 'website';
  let pageSpecificContent = '';
  
  // Generate specific content based on URL
  if (isBlogPage) {
    pageType = 'article';
    const blogTitle = metaTags.title.replace(' | College Forms Blog', '');
    
    pageSpecificContent = `
      <div class="blog-content">
        <h2>${blogTitle}</h2>
        <div class="blog-meta">
          <span class="author">By: ${metaTags.author || 'College Forms'}</span>
          <span class="date">Published: ${new Date().toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
        
        <div class="blog-excerpt">
          <p>${metaTags.description}</p>
        </div>
        
        <h3>Key Takeaways</h3>
        <ul class="content-list">
          <li>Expert insights on college admissions and education</li>
          <li>Latest trends in education and career opportunities</li>
          <li>Practical tips for entrance exam preparation</li>
          <li>Scholarship and financial aid information</li>
          <li>Career guidance and future prospects</li>
        </ul>
        
        <div class="highlight-box">
          <h3>About College Forms Blog</h3>
          <p>Our blog provides expert guidance on college admissions, entrance exams, career choices, and educational trends. Stay updated with the latest information to make informed decisions about your education.</p>
        </div>
      </div>
    `;
  } else if (isBlogList) {
    pageSpecificContent = `
      <div class="blog-listing">
        <h2>Latest Education Blogs & Articles</h2>
        <p>Explore our collection of expert articles on college admissions, entrance exams, career guidance, and study tips.</p>
        
        <div class="features-grid">
          <div class="feature-card">
            <h4>📚 Admission Tips</h4>
            <p>Learn how to ace college applications and interviews</p>
          </div>
          <div class="feature-card">
            <h4>🎯 Exam Preparation</h4>
            <p>Strategies for JEE, NEET, CAT, and other entrance exams</p>
          </div>
          <div class="feature-card">
            <h4>💰 Scholarships</h4>
            <p>Find information on scholarships and financial aid</p>
          </div>
          <div class="feature-card">
            <h4>💼 Career Guidance</h4>
            <p>Explore career options and future prospects</p>
          </div>
        </div>
        
        <h3>Popular Blog Categories</h3>
        <ul class="content-list">
          <li>College Admission Process</li>
          <li>Entrance Exam Preparation</li>
          <li>Scholarship Information</li>
          <li>Career Guidance</li>
          <li>Study Abroad</li>
          <li>Online Education</li>
        </ul>
        
        <div class="highlight-box">
          <h3>Why Read Our Blog?</h3>
          <p>Stay updated with the latest education trends, get expert admission tips, and discover scholarship opportunities. Our blog is regularly updated with fresh content to help you make informed decisions about your education.</p>
        </div>
      </div>
    `;
  } else if (isCollegePage) {
    const collegeName = metaTags.title.split(' - ')[0];
    
    pageSpecificContent = `
      <div class="college-content">
        <h2>${collegeName} Information</h2>
        <p>${metaTags.description}</p>
        
        <div class="highlight-box">
          <h3>College Overview</h3>
          <p>Get complete details about ${collegeName} including courses offered, fee structure, placement records, admission process, and important dates.</p>
        </div>
        
        <h3>Key Information</h3>
        <div class="features-grid">
          <div class="feature-card">
            <h4>🎓 Courses Offered</h4>
            <p>Explore various undergraduate and postgraduate programs</p>
          </div>
          <div class="feature-card">
            <h4>💰 Fee Structure</h4>
            <p>Get detailed fee information with scholarship options</p>
          </div>
          <div class="feature-card">
            <h4>📈 Placements</h4>
            <p>Check placement records and company information</p>
          </div>
          <div class="feature-card">
            <h4>📝 Admission Process</h4>
            <p>Complete admission guidance and application help</p>
          </div>
        </div>
        
        <h3>Why Apply Through College Forms?</h3>
        <ul class="content-list">
          <li>Exclusive discounts on application fees</li>
          <li>Expert admission counseling for ${collegeName}</li>
          <li>Scholarship and financial aid assistance</li>
          <li>Document preparation and verification help</li>
          <li>Personalized college selection guidance</li>
        </ul>
      </div>
    `;
  } else if (url.includes('/step')) {
    pageSpecificContent = `
      <div class="step-content">
        <h2>Step-by-Step College Admission Guide</h2>
        <p>Follow our comprehensive guide to navigate the college admission process smoothly and successfully.</p>
        
        <div class="highlight-box">
          <h3>Complete Admission Process</h3>
          <p>From choosing the right college to securing admission - we guide you through every step.</p>
        </div>
        
        <h3>Admission Steps</h3>
        <ol class="content-list" style="list-style-type: decimal;">
          <li><strong>Research & Selection:</strong> Find colleges matching your preferences and eligibility</li>
          <li><strong>Document Preparation:</strong> Gather all required documents and certificates</li>
          <li><strong>Application Submission:</strong> Fill and submit applications with our expert help</li>
          <li><strong>Entrance Exam Preparation:</strong> Prepare for required entrance tests</li>
          <li><strong>Interview & Counseling:</strong> Get ready for admission interviews</li>
          <li><strong>Admission Confirmation:</strong> Complete admission formalities</li>
        </ol>
        
        <div class="features-grid">
          <div class="feature-card">
            <h4>📋 Personalized Guidance</h4>
            <p>Get one-on-one counseling based on your profile</p>
          </div>
          <div class="feature-card">
            <h4>📄 Document Help</h4>
            <p>Assistance with all required documents and forms</p>
          </div>
          <div class="feature-card">
            <h4>🎯 Exam Preparation</h4>
            <p>Resources and tips for entrance exams</p>
          </div>
          <div class="feature-card">
            <h4>✅ Application Review</h4>
            <p>Expert review of your applications before submission</p>
          </div>
        </div>
      </div>
    `;
  } else if (url.includes('/offer')) {
    pageSpecificContent = `
      <div class="offer-content">
        <h2>Exclusive Offers & Discounts</h2>
        <p>Save money on college application fees with our special offers and discounts.</p>
        
        <div class="highlight-box">
          <h3>Limited Time Offers</h3>
          <p>Apply to top colleges with special discounted rates available only through College Forms.</p>
        </div>
        
        <h3>Current Offers</h3>
        <div class="features-grid">
          <div class="feature-card">
            <h4>🎓 Engineering Colleges</h4>
            <p>Up to 50% off on application fees</p>
            <p><strong>Valid until: ${new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()}</strong></p>
          </div>
          <div class="feature-card">
            <h4>🏥 Medical Colleges</h4>
            <p>40% discount on admission forms</p>
            <p><strong>Limited seats available</strong></p>
          </div>
          <div class="feature-card">
            <h4>💼 Management Colleges</h4>
            <p>Special MBA application discounts</p>
            <p><strong>Apply before deadline</strong></p>
          </div>
          <div class="feature-card">
            <h4>🎨 Arts & Science</h4>
            <p>Scholarship-linked application offers</p>
            <p><strong>Merit-based discounts</strong></p>
          </div>
        </div>
        
        <h3>How to Avail Offers?</h3>
        <ul class="content-list">
          <li>Register on College Forms platform</li>
          <li>Select your preferred colleges</li>
          <li>Apply through our platform to get automatic discounts</li>
          <li>Contact our support team for exclusive offers</li>
        </ul>
      </div>
    `;
  } else if (url.includes('/education/education-loan')) {
    pageSpecificContent = `
      <div class="loan-content">
        <h2>Education Loan Assistance</h2>
        <p>Get complete guidance and assistance for education loans to fund your college studies.</p>
        
        <div class="highlight-box">
          <h3>Why Choose Our Loan Assistance?</h3>
          <p>We partner with leading banks and financial institutions to get you the best education loan rates with minimal documentation.</p>
        </div>
        
        <h3>Loan Services</h3>
        <div class="features-grid">
          <div class="feature-card">
            <h4>🏦 Bank Partnerships</h4>
            <p>Tie-ups with 20+ leading banks</p>
          </div>
          <div class="feature-card">
            <h4>💰 Best Interest Rates</h4>
            <p>Competitive rates starting from 8.5%</p>
          </div>
          <div class="feature-card">
            <h4>📄 Minimal Documentation</h4>
            <p>Simplified documentation process</p>
          </div>
          <div class="feature-card">
            <h4>⏱️ Quick Processing</h4>
            <p>Fast loan approval within 7-10 days</p>
          </div>
        </div>
        
        <h3>Eligibility Criteria</h3>
        <ul class="content-list">
          <li>Indian citizenship</li>
          <li>Admission confirmation from recognized college</li>
          <li>Co-applicant (parent/guardian) with stable income</li>
          <li>Good academic record</li>
        </ul>
        
        <h3>Documents Required</h3>
        <ul class="content-list">
          <li>Admission letter from college</li>
          <li>Fee structure from college</li>
          <li>Identity and address proof</li>
          <li>Income proof of co-applicant</li>
          <li>Academic certificates</li>
        </ul>
      </div>
    `;
  } else {
    // Default content for other pages
    pageSpecificContent = `
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
    `;
  }
  
  return `<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary Meta Tags -->
    <title>${metaTags.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</title>
    <meta name="description" content="${metaTags.description.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}">
    <meta name="keywords" content="${metaTags.keywords}">
    
    <!-- Canonical URL - Explicit for blog listing -->
    <link rel="canonical" href="${metaTags.canonical}">
    ${isBlogList ? `<!-- Explicit canonical for blog listing page -->
    <link rel="canonical" href="https://www.collegeforms.in/blogs/">
    <link rel="alternate" href="https://www.collegeforms.in/blogs/" hreflang="x-default">
    <link rel="alternate" href="https://www.collegeforms.in/blogs/" hreflang="en-in">` : ''}
    
    <!-- Additional Link Tags -->
    ${linkTags}
    
    <!-- Hreflang Tags -->
    ${hreflangTags}
    
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
    <meta property="og:type" content="${pageType}">
    <meta property="og:url" content="${metaTags.canonical}">
    <meta property="og:title" content="${metaTags.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')}">
    <meta property="og:description" content="${metaTags.description.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}">
    <meta property="og:image" content="${metaTags.ogImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="College Forms">
    ${isBlogPage ? `<meta property="article:author" content="${metaTags.author}">` : ''}
    ${isBlogPage ? `<meta property="article:published_time" content="${new Date().toISOString()}">` : ''}
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${metaTags.canonical}">
    <meta name="twitter:title" content="${metaTags.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')}">
    <meta name="twitter:description" content="${metaTags.description.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}">
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
        .blog-meta {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
            color: #6b7280;
            font-size: 0.9rem;
        }
        .blog-excerpt {
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .college-content .feature-card {
            text-align: left;
        }
        ol.content-list {
            list-style-type: decimal;
            padding-left: 40px;
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
            .features-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="seo-container">
        <h1>${metaTags.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</h1>
        <p>${metaTags.description.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        
        ${pageSpecificContent}
        
        <div style="text-align: center; margin-top: 40px;">
            <a href="${metaTags.canonical}" class="cta-button">Visit College Forms for Complete Details</a>
            <a href="https://www.collegeforms.in/contactus" class="cta-button" style="margin-left: 15px; background: #6b7280;">Get Expert Help</a>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p><strong>About College Forms:</strong> College Forms is India's leading platform for college admissions, trusted by thousands of students for authentic information, exclusive discounts, and expert guidance.</p>
            <p><strong>Contact:</strong> For admission queries, call us at +91-XXXXXXXXXX or email at support@collegeforms.in</p>
        </div>
    </div>
</body>
</html>`;
};

// Canonical redirect middleware - add this BEFORE seoMiddleware
export const canonicalRedirectMiddleware = (req, res, next) => {
  const url = req.url;
  const hasTrailingSlash = url.endsWith('/');
  const hasFileExtension = /\.\w+$/.test(url);
  const isRoot = url === '/';
  const hasQueryParams = url.includes('?');
  
  // List of affected pages that need canonical fixes
  const affectedPages = [
    '/blogs/cuet-ug-2026-colleges-courses-admission-process-explained',
    '/studyabroad',
    '/blogs/bba-llb-with-business-law-specialization-top-colleges-fees-and-career-scope',
    '/blogs/best-government-bca-colleges-in-india-fees-admission-placements-2026',
    '/offer',
    '/students/tests',
    '/competitiveexams',
    '/CompetitiveExams'
  ];
  
  // Get path without query parameters
  const pathWithoutQuery = url.split('?')[0];
  const normalizedPath = pathWithoutQuery.replace(/\/$/, ''); // Remove trailing slash for comparison
  
  // SPECIFIC FIX FOR /blogs PAGE
  if (normalizedPath.toLowerCase() === '/blogs') {
    const canonicalUrl = 'https://www.collegeforms.in/blogs/';
    res.setHeader('Link', `<${canonicalUrl}>; rel="canonical"`);
    res.setHeader('X-Robots-Tag', 'index, follow');
    
    // Redirect if missing trailing slash
    if (!hasTrailingSlash && !hasFileExtension && !isRoot) {
      console.log(`🔄 Redirecting /blogs to /blogs/`);
      const queryString = hasQueryParams ? '?' + url.split('?')[1] : '';
      return res.redirect(301, '/blogs/' + queryString);
    }
  }
  
  // Check if this is an affected page
  if (affectedPages.includes(normalizedPath.toLowerCase())) {
    const canonicalUrl = `https://www.collegeforms.in${normalizedPath}/`;
    res.setHeader('Link', `<${canonicalUrl}>; rel="canonical"`);
    
    // Redirect if missing trailing slash
    if (!hasTrailingSlash && !hasFileExtension && !isRoot) {
      console.log(`🔄 Redirecting affected page: ${url} -> ${normalizedPath}/`);
      const queryString = hasQueryParams ? '?' + url.split('?')[1] : '';
      return res.redirect(301, normalizedPath + '/' + queryString);
    }
  }
  
  // Add trailing slash for all non-file URLs (general rule)
  if (!hasTrailingSlash && !hasFileExtension && !isRoot && !url.includes('.')) {
    // Preserve query parameters if any
    const queryString = hasQueryParams ? '?' + url.split('?')[1] : '';
    const newUrl = pathWithoutQuery + '/' + queryString;
    
    console.log(`🔄 Adding trailing slash: ${url} -> ${newUrl}`);
    return res.redirect(301, newUrl);
  }
  
  next();
};

// Specific middleware for blog canonical fix
export const blogCanonicalFix = (req, res, next) => {
  const url = req.url;
  
  // Fix for /blogs page (with or without slash)
  if (url === '/blogs' || url === '/blogs/') {
    // Set canonical header
    res.setHeader('Link', '<https://www.collegeforms.in/blogs/>; rel="canonical"');
    res.setHeader('X-Robots-Tag', 'index, follow');
    
    // Also set in response locals for use in template
    res.locals.canonical = 'https://www.collegeforms.in/blogs/';
    
    console.log('✅ Set canonical for /blogs/ page');
  }
  
  next();
};

// Enhanced SEO Middleware with better bot detection
export const seoMiddleware = async (req, res, next) => {
  const userAgent = req.get('user-agent') || '';
  const url = req.originalUrl;
  
  console.log(`🔍 SEO Middleware checking: ${url}, User-Agent: ${userAgent.substring(0, 100)}`);
  
  // Skip for non-HTML requests
  const skipPatterns = [
    '/api/',
    '/uploads/',
    '/static/',
    '/_next/',
    'manifest.json',
    'robots.txt',
    'sitemap.xml',
    '.json',
    '.xml',
    '.txt',
    '.ico',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.css',
    '.js',
    '.woff',
    '.woff2',
    '.ttf',
    '.webp'
  ];
  
  if (skipPatterns.some(pattern => url.includes(pattern))) {
    console.log(`⏭️ Skipping SEO for non-HTML: ${url}`);
    return next();
  }
  
  // Enhanced bot detection
  const isBot = (ua) => {
    if (!ua) return false;
    
    const lowerUA = ua.toLowerCase();
    
    const bots = [
      'googlebot',
      'google-inspectiontool',
      'mediapartners-google',
      'adsbot-google',
      'bingbot',
      'msnbot',
      'msnbot-media',
      'bingpreview',
      'slurp',
      'facebookexternalhit',
      'facebot',
      'twitterbot',
      'linkedinbot',
      'pinterest',
      'pinterestbot',
      'ahrefsbot',
      'semrushbot',
      'moz.com',
      'mj12bot',
      'dotbot',
      'rogerbot',
      'yandexbot',
      'baiduspider',
      'duckduckbot',
      'applebot',
      'sogou',
      'exabot',
      'ccbot',
      'gptbot',
      'chatgpt',
      'anthropic',
      'claudebot',
      'perplexity',
      'bot',
      'crawler',
      'spider',
      'scraper',
      'monitor'
    ];
    
    return bots.some(bot => lowerUA.includes(bot));
  };
  
  // Check if it's a bot request
  if (isBot(userAgent)) {
    console.log(`🤖 Bot detected for URL: ${url}`);
    
    try {
      // Get dynamic meta tags
      const metaTags = await getDynamicMetaTags(url);
      
      // Generate HTML for bots
      const botHTML = generateBotHTML(metaTags, url);
      
      // Set headers
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=7200');
      res.setHeader('Vary', 'User-Agent');
      res.setHeader('X-Robots-Tag', metaTags.robots);
      
      console.log(`✅ Serving SEO HTML for: ${url}`);
      console.log(`📝 Title: ${metaTags.title.substring(0, 50)}...`);
      console.log(`🔗 Canonical: ${metaTags.canonical}`);
      console.log(`🤖 User-Agent: ${userAgent.substring(0, 50)}...`);
      
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

// Debug endpoint to test SEO middleware
export const debugSeoMiddleware = async (req, res) => {
  const url = req.query.url || req.originalUrl;
  console.log('Debug SEO for URL:', url);
  
  try {
    const metaTags = await getDynamicMetaTags(url);
    const isBotCheck = (ua) => {
      if (!ua) return false;
      const lowerUA = ua.toLowerCase();
      const bots = ['googlebot', 'bingbot', 'slurp', 'facebookexternalhit', 'twitterbot'];
      return bots.some(bot => lowerUA.includes(bot));
    };
    
    res.json({
      url,
      metaTags,
      userAgent: req.get('user-agent'),
      isBot: isBotCheck(req.get('user-agent')),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};