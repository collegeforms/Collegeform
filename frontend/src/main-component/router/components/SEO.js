// frontend/src/main-component/router/components/SEO.jsx
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({ 
  title, 
  description, 
  canonical, 
  ogImage, 
  ogType = 'website',
  structuredData,
  noIndex = false,
  keywords = ''
}) => {
  const location = useLocation();
  const siteUrl = 'https://www.collegeforms.in';
  const siteName = 'College Forms';
  const currentYear = new Date().getFullYear();
  
  // Default values matching your homepage
  const defaultTitle = "India's most preferred and trusted online platform for discounted College Applications | College Forms";
  const defaultDescription = "Explore top colleges, best courses after 12th, MBA & BBA entrance exams, and get expert college admission help. Discover scholarships, discounts on forms, and college guidance at CollegeForms.in.";
  const defaultKeywords = "best colleges in India, college admission help, MBA entrance exams, course selection guidance, tuition fee discounts, scholarships after 12th, scholarships on tuition fees";
  const defaultImage = `${siteUrl}/uploads/og-default.jpg`;
  
  // Construct final values
  const seoTitle = title || defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoCanonical = canonical ? `${siteUrl}${canonical}` : `${siteUrl}${location.pathname}`;
  const seoImage = ogImage || defaultImage;
  const seoKeywords = keywords || defaultKeywords;
  
  // Remove query params from canonical URL
  const cleanCanonical = seoCanonical.split('?')[0];

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <link rel="canonical" href={cleanCanonical} />
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <>
          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          <meta name="bingbot" content="index, follow, max-image-preview:large" />
        </>
      )}

      {/* Author & Publisher */}
      <meta name="author" content="College Forms" />
      <meta name="publisher" content="College Forms" />
      <meta name="copyright" content={`Copyright © ${currentYear} College Forms. All rights reserved.`} />
      
      {/* Language */}
      <meta name="language" content="en" />
      <meta property="og:locale" content="en_IN" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={cleanCanonical} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={cleanCanonical} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:site" content="@CollegeForms" />
      <meta name="twitter:creator" content="@CollegeForms" />
      
      {/* Additional SEO Tags */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      <meta name="ICBM" content="20.5937, 78.9629" />
      
      {/* Mobile & PWA */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Default Organization Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "College Forms",
          "url": "https://www.collegeforms.in",
          "logo": "https://www.collegeforms.in/logo.png",
          "description": "India's most preferred and trusted online platform for discounted College Applications",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-XXXXXXXXXX",
            "contactType": "Customer Support",
            "areaServed": "IN",
            "availableLanguage": ["English", "Hindi"]
          },
          "sameAs": [
            "https://www.facebook.com/collegeforms",
            "https://twitter.com/CollegeForms",
            "https://www.linkedin.com/company/collegeforms",
            "https://www.instagram.com/collegeforms"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;