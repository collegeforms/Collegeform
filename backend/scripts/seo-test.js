// backend/scripts/seo-test.js
import fetch from 'node-fetch';

const testUrls = [
  '/',
  '/colleges',
  '/college/iit-delhi',
  '/course/btech-computer-science',
  '/blog/how-to-choose-right-college',
  '/exams',
  '/about',
  '/contact'
];

const testBots = [
  {
    name: 'Googlebot',
    agent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
  },
  {
    name: 'Facebook',
    agent: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
  },
  {
    name: 'Twitter',
    agent: 'Twitterbot/1.0'
  },
  {
    name: 'LinkedIn',
    agent: 'LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)'
  }
];

async function testSEO() {
  console.log('🔍 Starting SEO Tests...\n');
  console.log('='.repeat(80));
  
  for (const url of testUrls) {
    console.log(`\n📄 Testing: ${url}`);
    console.log('-'.repeat(40));
    
    for (const bot of testBots) {
      try {
        const response = await fetch(`http://localhost:5000${url}`, {
          headers: { 'User-Agent': bot.agent },
          timeout: 10000
        });
        
        const html = await response.text();
        
        // Check for SEO elements
        const checks = {
          'Title': html.includes('<title>'),
          'Description': html.includes('name="description"'),
          'Canonical': html.includes('rel="canonical"'),
          'Open Graph': html.includes('og:title'),
          'Twitter Card': html.includes('twitter:card'),
          'Structured Data': html.includes('application/ld+json'),
          'H1 Tag': html.includes('<h1>')
        };
        
        console.log(`🤖 ${bot.name}:`);
        Object.entries(checks).forEach(([check, passed]) => {
          console.log(`   ${passed ? '✅' : '❌'} ${check}`);
        });
        
      } catch (error) {
        console.log(`🤖 ${bot.name}: ❌ Error - ${error.message}`);
      }
    }
  }
  
  // Test sitemap
  console.log('\n🗺️ Testing Sitemap...');
  console.log('-'.repeat(40));
  try {
    const sitemapRes = await fetch('http://localhost:5000/sitemap.xml');
    const sitemap = await sitemapRes.text();
    
    const urlCount = (sitemap.match(/<url>/g) || []).length;
    const imageCount = (sitemap.match(/<image:image>/g) || []).length;
    
    console.log(`✅ Status: ${sitemapRes.status}`);
    console.log(`✅ URLs: ${urlCount}`);
    console.log(`✅ Images: ${imageCount}`);
    console.log(`✅ Size: ${(sitemap.length / 1024).toFixed(2)} KB`);
    
  } catch (error) {
    console.log(`❌ Sitemap Error: ${error.message}`);
  }
  
  // Test robots.txt
  console.log('\n🤖 Testing robots.txt...');
  console.log('-'.repeat(40));
  try {
    const robotsRes = await fetch('http://localhost:5000/robots.txt');
    const robots = await robotsRes.text();
    console.log(`✅ Status: ${robotsRes.status}`);
    console.log(`✅ Contains sitemap: ${robots.includes('Sitemap:')}`);
  } catch (error) {
    console.log(`❌ Robots.txt Error: ${error.message}`);
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ SEO Testing Complete!');
}

testSEO();