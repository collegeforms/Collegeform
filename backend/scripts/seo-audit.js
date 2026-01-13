// backend/scripts/seo-audit.js
import cron from 'node-cron';
import fetch from 'node-fetch';
import College from '../models/College.js';
import Course from '../models/course.js';

// Daily SEO audit at 3 AM
cron.schedule('0 3 * * *', async () => {
  console.log(`🔍 Running Daily SEO Audit: ${new Date().toISOString()}`);
  console.log('='.repeat(80));
  
  try {
    // 1. Check critical pages
    const criticalPages = [
      'https://www.collegeforms.in/',
      'https://www.collegeforms.in/colleges',
      'https://www.collegeforms.in/courses',
      'https://www.collegeforms.in/sitemap.xml',
      'https://www.collegeforms.in/robots.txt'
    ];
    
    console.log('\n📄 Page Status Check:');
    for (const page of criticalPages) {
      try {
        const response = await fetch(page, { timeout: 10000 });
        console.log(`   ${response.status === 200 ? '✅' : '❌'} ${page}: ${response.status}`);
      } catch (error) {
        console.log(`   ❌ ${page}: ${error.message}`);
      }
    }
    
    // 2. Check database counts
    console.log('\n📊 Database Counts:');
    const collegeCount = await College.countDocuments({ isActive: true });
    const courseCount = await Course.countDocuments({ isActive: true });
    console.log(`   ✅ Active Colleges: ${collegeCount}`);
    console.log(`   ✅ Active Courses: ${courseCount}`);
    
    // 3. Check for missing meta data
    console.log('\n🔍 Missing Metadata Check:');
    const collegesWithoutDescription = await College.countDocuments({
      isActive: true,
      $or: [
        { description: { $exists: false } },
        { description: '' },
        { description: { $regex: /^\s*$/ } }
      ]
    });
    
    console.log(`   ${collegesWithoutDescription === 0 ? '✅' : '⚠️'} Colleges without description: ${collegesWithoutDescription}`);
    
    // 4. Check sitemap freshness
    console.log('\n📅 Sitemap Freshness:');
    const sitemapRes = await fetch('https://www.collegeforms.in/sitemap.xml');
    const sitemap = await sitemapRes.text();
    const today = new Date().toISOString().split('T')[0];
    const isFresh = sitemap.includes(today);
    console.log(`   ${isFresh ? '✅' : '⚠️'} Sitemap updated today: ${isFresh}`);
    
    // 5. Check college with most views
    const popularCollege = await College.findOne({ isActive: true })
      .sort('-views')
      .select('name views slug')
      .lean();
    
    if (popularCollege) {
      console.log(`\n🏆 Most Popular College:`);
      console.log(`   ${popularCollege.name}: ${popularCollege.views || 0} views`);
      console.log(`   URL: /college/${popularCollege.slug}`);
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ Daily SEO Audit Complete!');
    
  } catch (error) {
    console.error('❌ SEO Audit Error:', error);
  }
});

console.log('🚀 SEO Audit Scheduler Started (Runs daily at 3 AM)...');