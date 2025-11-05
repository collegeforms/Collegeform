module.exports = {
  source: "build",
  include: ['/'],
  exclude: [
    '/404',
    '/admin',
    '/login'
  ],
  skipThirdPartyRequests: true,
  concurrency: 4,
  puppeteerArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-web-security',
    '--disable-features=IsolateOrigins,site-per-process'
  ],
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
  viewport: {
    width: 1200,
    height: 800
  },
  cache: false,
  waitForTimeout: 10000,
  navigateOptions: {
    timeout: 30000,
    waitUntil: 'networkidle2'
  }
};