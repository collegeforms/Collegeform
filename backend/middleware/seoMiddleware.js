// /var/www/collegeform/backend/middleware/seoMiddleware.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Bot user agents detection
const BOT_USER_AGENTS = [
    'googlebot', 'googlebot-mobile', 'googlebot-image', 'mediapartners-google',
    'bingbot', 'slurp', 'yandex', 'yandexbot', 'yandeximages', 'yandexvideo',
    'baiduspider', 'duckduckbot', 'facebot', 'facebookexternalhit', 'facebookcatalog',
    'twitterbot', 'rogerbot', 'linkedinbot', 'embedly', 'quora link preview',
    'showyoubot', 'outbrain', 'pinterest', 'slackbot', 'vkShare', 'redditbot',
    'applebot', 'whatsapp', 'telegrambot', 'discordbot', 'skypeuripreview',
    'ia_archiver', 'archive.org_bot', 'msnbot', 'msnbot-media', 'adsbot-google',
    'developers.google.com/+/web/snippet'
];

// Check if user agent is a bot
export const isBot = (userAgent) => {
    if (!userAgent) return false;
    const ua = userAgent.toLowerCase();
    return BOT_USER_AGENTS.some(bot => ua.includes(bot));
};

// Route-specific meta data
export const ROUTE_META_DATA = {
    '/': {
        title: "CollegeForms.in - India's most preferred and trusted online platform for discounted College Applications",
        description: "Explore top colleges, best courses after 12th, MBA & BBA entrance exams, and get expert college admission help. Discover scholarships, discounts on forms, and college guidance at CollegeForms.in.",
        keywords: "best colleges in India, college admission help, MBA entrance exams, course selection guidance, tuition fee discounts, scholarships after 12th, scholarships on tuition fees",
        ogImage: "https://collegeforms.in/college-forms-og-image.jpg",
        canonical: "https://collegeforms.in/"
    },

    '/studyabroad': {
        title: "Study Abroad Programs – Scholarships & Admissions | CollegeForms",
        description: "Looking to study abroad? Explore top international colleges, scholarships on tuition, and MBA programs. Get expert college guidance and application help with CollegeForms.in.",
        keywords: "study abroad programs, international colleges, MBA abroad options, tuition fee scholarships, overseas admission help, best global colleges, IELTS EXAMs, SAT Exam, GRE/GMAT Exam",
        ogImage: "https://collegeforms.in/study-abroad-og-image.jpg",
        canonical: "https://collegeforms.in/studyabroad"
    },

    '/colleges': {
        title: "Top Colleges in India - Rankings, Fees, Admission | CollegeForms",
        description: "Find the best colleges in India with rankings, fees structure, admission process, and student reviews. Get expert guidance for college selection.",
        keywords: "colleges in India, college rankings, admission process, college fees, top engineering colleges, top medical colleges, management colleges",
        ogImage: "https://collegeforms.in/colleges-og-image.jpg",
        canonical: "https://collegeforms.in/colleges"
    },

    '/blogs': {
        title: "Education Blog - Latest Updates & Guidance | CollegeForms",
        description: "Latest education news, career guidance, college admission tips, and exam preparation strategies. Stay updated with the education sector.",
        keywords: "education blog, career guidance, admission tips, exam preparation, education news, college admission blog",
        ogImage: "https://collegeforms.in/blogs-og-image.jpg",
        canonical: "https://collegeforms.in/blogs"
    },

    '/contactus': {
        title: "Contact Us - Get College Admission Help | CollegeForms",
        description: "Get in touch with our education experts for college admission guidance, scholarship information, and application help.",
        keywords: "contact college admission help, education consultants, admission guidance contact",
        ogImage: "https://collegeforms.in/contact-og-image.jpg",
        canonical: "https://collegeforms.in/contactus"
    },

    '/courses': {
        title: "Popular Courses & Career Options | CollegeForms",
        description: "Explore popular courses after 12th, career options, and find the right path for your future. Get guidance on course selection.",
        keywords: "courses after 12th, career options, course selection, engineering courses, medical courses",
        ogImage: "https://collegeforms.in/courses-og-image.jpg",
        canonical: "https://collegeforms.in/courses"
    },

    '/exams': {
        title: "Entrance Exams Preparation & Guidance | CollegeForms",
        description: "Prepare for various entrance exams with expert guidance, tips, and resources. Get information about exam dates and patterns.",
        keywords: "entrance exams, exam preparation, JEE, NEET, CAT, MAT, exam dates",
        ogImage: "https://collegeforms.in/exams-og-image.jpg",
        canonical: "https://collegeforms.in/exams"
    },

    '/students/tests': {
        title: "Online Tests & Practice Papers | CollegeForms",
        description: "Take online practice tests, mock exams, and improve your preparation with our test series for various entrance exams.",
        keywords: "online tests, practice papers, mock exams, test series",
        ogImage: "https://collegeforms.in/tests-og-image.jpg",
        canonical: "https://collegeforms.in/students/tests"
    },

    '/events': {
        title: "Education Events & Workshops | CollegeForms",
        description: "Stay updated with upcoming education events, workshops, webinars, and college fairs. Participate and enhance your knowledge.",
        keywords: "education events, workshops, webinars, college fairs",
        ogImage: "https://collegeforms.in/events-og-image.jpg",
        canonical: "https://collegeforms.in/events"
    },

    '/video': {
        title: "Educational Videos & Tutorials | CollegeForms",
        description: "Watch educational videos, tutorials, and expert talks on college admissions, exam preparation, and career guidance.",
        keywords: "educational videos, tutorials, expert talks",
        ogImage: "https://collegeforms.in/video-og-image.jpg",
        canonical: "https://collegeforms.in/video"
    },

    '/privacy': {
        title: "Privacy Policy | CollegeForms",
        description: "Read our privacy policy to understand how we collect, use, and protect your personal information.",
        keywords: "privacy policy, data protection, terms of use",
        ogImage: "https://collegeforms.in/privacy-og-image.jpg",
        canonical: "https://collegeforms.in/privacy"
    },

    '/terms': {
        title: "Terms & Conditions | CollegeForms",
        description: "Read our terms and conditions for using CollegeForms.in services and platform.",
        keywords: "terms and conditions, user agreement, legal terms",
        ogImage: "https://collegeforms.in/terms-og-image.jpg",
        canonical: "https://collegeforms.in/terms"
    }
};

// Read index.html once and cache it
let cachedIndexHtml = null;

const readIndexHtml = () => {
    if (cachedIndexHtml) {
        return cachedIndexHtml;
    }
    
    try {
        const indexPath = path.join(__dirname, '../../frontend/build/index.html');
        cachedIndexHtml = fs.readFileSync(indexPath, 'utf8');
        console.log('📁 Index.html loaded successfully');
        return cachedIndexHtml;
    } catch (error) {
        console.error('❌ Failed to load index.html:', error.message);
        return '<html><head><title>CollegeForms</title></head><body><div id="root"></div></body></html>';
    }
};

// Generate HTML with meta tags
const generateSEOHTML = (meta, htmlTemplate) => {
    const metaTags = `
        <title>${meta.title}</title>
        <meta name="description" content="${meta.description}" />
        <meta name="keywords" content="${meta.keywords}" />
        <link rel="canonical" href="${meta.canonical}" />
        
        <!-- Open Graph -->
        <meta property="og:type" content="website" />
        <meta property="og:url" content="${meta.canonical}" />
        <meta property="og:title" content="${meta.title}" />
        <meta property="og:description" content="${meta.description}" />
        <meta property="og:image" content="${meta.ogImage}" />
        <meta property="og:site_name" content="College Forms" />
        
        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="${meta.canonical}" />
        <meta name="twitter:title" content="${meta.title}" />
        <meta name="twitter:description" content="${meta.description}" />
        <meta name="twitter:image" content="${meta.ogImage}" />
        
        <!-- Additional SEO -->
        <meta name="robots" content="index, follow" />
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="English" />
        <meta name="author" content="College Forms" />
    `;

    // Replace the entire head section with new meta tags
    const newHead = `<head>
        <meta charset="utf-8"/>
        <link rel="icon" href="/favicon.png"/>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <meta name="theme-color" content="#000000"/>
        ${metaTags}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer"/>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-DMZRBF2RQ1"></script>
        <script>function gtag(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag("js",new Date),gtag("config","G-DMZRBF2RQ1")</script>
        <script>!function(e,t,a,n,g){e[n]=e[n]||[],e[n].push({"gtm.start":(new Date).getTime(),event:"gtm.js"});var m=t.getElementsByTagName(a)[0],r=t.createElement(a);r.async=!0,r.src="https://www.googletagmanager.com/gtm.js?id=GTM-549BCBRD",m.parentNode.insertBefore(r,m)}(window,document,"script","dataLayer")</script>
        <script defer="defer" src="/static/js/main.ba321a83.js"></script>
        <link href="/static/css/main.28da5570.css" rel="stylesheet">
    </head>`;
    
    return htmlTemplate.replace(/<head>[\s\S]*?<\/head>/, newHead);
};

// Main middleware function
export const seoMiddleware = (req, res, next) => {
    const userAgent = req.headers['user-agent'] || '';
    const requestPath = req.path;
    
    // Skip for API, static files, sitemap, etc.
    if (requestPath.startsWith('/api/') || 
        requestPath.startsWith('/static/') ||
        requestPath.startsWith('/uploads/') ||
        requestPath === '/sitemap.xml' ||
        requestPath === '/robots.txt' ||
        requestPath.includes('.')) {
        return next();
    }
    
    // Check if it's a bot
    if (isBot(userAgent)) {
        console.log(`🤖 Bot detected: ${userAgent.substring(0, 50)}...`);
        console.log(`📄 Requested path: ${requestPath}`);
        
        try {
            // Read the HTML template
            const htmlTemplate = readIndexHtml();
            
            // Get meta data for this route
            let metaData = ROUTE_META_DATA[requestPath];
            
            // Use default if no specific meta found
            if (!metaData) {
                metaData = ROUTE_META_DATA['/'];
            }
            
            // Generate and send SEO-optimized HTML
            const seoHtml = generateSEOHTML(metaData, htmlTemplate);
            
            console.log(`✅ Serving SEO HTML for: ${requestPath}`);
            console.log(`   Title: ${metaData.title.substring(0, 50)}...`);
            
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.send(seoHtml);
            
        } catch (error) {
            console.error('❌ SEO middleware error:', error.message);
            next(); // Fall back to normal React app
        }
    } else {
        // Normal user - serve React app as usual
        next();
    }
};