// frontend/src/components/SEO.jsx
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({ 
  title, 
  description, 
  canonical, 
  ogImage, 
  ogType = 'website',
  structuredData,
  noIndex = false 
}) => {
  const location = useLocation();
  const siteUrl = 'https://www.collegeforms.in';
  const siteName = 'College Forms';
  
  const defaultTitle = 'College Forms - College Admissions & Application Forms';
  const defaultDescription = 'Apply to 1000+ colleges in India. Get free admission counseling, application forms for UG/PG courses, entrance exam details & more.';
  const defaultImage = `${siteUrl}/uploads/og-default.jpg`;
  
  // Construct final values
  const seoTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoCanonical = canonical || `${siteUrl}${location.pathname}`;
  const seoImage = ogImage || defaultImage;
  
  // Remove query params from canonical
  const cleanCanonical = seoCanonical.split('?')[0];

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content="college admission, application forms, UG courses, PG courses, entrance exams, India colleges" />
      <link rel="canonical" href={cleanCanonical} />
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={cleanCanonical} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={cleanCanonical} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      <meta name="twitter:site" content="@CollegeForms" />

      {/* Additional SEO Tags */}
      <meta name="author" content={siteName} />
      <meta name="copyright" content={`Copyright © ${new Date().getFullYear()} ${siteName}`} />
      <meta name="language" content="English" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      
      {/* Mobile & PWA */}
      <meta name="theme-color" content="#2563eb" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;