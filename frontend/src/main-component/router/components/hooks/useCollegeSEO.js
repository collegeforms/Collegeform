// frontend/src/hooks/useCollegeSEO.js
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export const useCollegeSEO = () => {
  const { slug } = useParams();
  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        const response = await api.get(`/api/colleges/${slug}`);
        setCollege(response.data);
      } catch (error) {
        console.error('Error fetching college for SEO:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCollege();
    }
  }, [slug]);

  const getStructuredData = () => {
    if (!college) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "CollegeOrUniversity",
      "name": college.name,
      "description": college.description?.substring(0, 200),
      "url": `https://www.collegeforms.in/college/${college.slug}`,
      "logo": college.logo ? `https://www.collegeforms.in${college.logo}` : null,
      "image": college.images?.[0] ? `https://www.collegeforms.in${college.images[0]}` : null,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": college.address,
        "addressLocality": college.city,
        "addressRegion": college.state,
        "postalCode": college.pincode,
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": college.phone,
        "contactType": "Admission Inquiry",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"]
      },
      "aggregateRating": college.rating ? {
        "@type": "AggregateRating",
        "ratingValue": college.rating,
        "ratingCount": college.reviewCount || 10,
        "bestRating": "5",
        "worstRating": "1"
      } : undefined
    };
  };

  return {
    title: college ? `${college.name} | Admission 2024, Courses, Fees, Placement` : 'College Details',
    description: college ? `${college.description?.substring(0, 160)}...` : 'Get complete college details',
    canonical: college ? `/college/${college.slug}` : null,
    ogImage: college?.logo ? `https://www.collegeforms.in${college.logo}` : null,
    structuredData: getStructuredData(),
    loading
  };
};

// frontend/src/hooks/usePageSEO.js
export const usePageSEO = (pageType, data) => {
  const getMetaByPageType = () => {
    const base = {
      title: '',
      description: '',
      canonical: '',
      ogType: 'website'
    };

    switch (pageType) {
      case 'home':
        return {
          ...base,
          title: 'College Forms - Online College Admission & Application Forms 2024',
          description: 'Apply to 1000+ colleges online. Free admission counseling for engineering, medical, management, arts courses.',
          canonical: '/'
        };
        
      case 'colleges':
        return {
          ...base,
          title: 'Colleges in India - Top Engineering, Medical, Arts Colleges',
          description: 'Browse 5000+ colleges in India by location, course, specialization.',
          canonical: '/colleges'
        };
        
      case 'courses':
        return {
          ...base,
          title: 'Courses in India - Engineering, Medical, Management, Arts',
          description: 'Explore 200+ courses in India: BTech, MBBS, MBA, BBA, BSc, BA, etc.',
          canonical: '/courses'
        };
        
      case 'exams':
        return {
          ...base,
          title: 'Entrance Exams 2024 - JEE, NEET, CAT, UPSC, SSC',
          description: 'Complete guide to entrance exams in India: JEE Main, NEET, CAT, MAT, CLAT, UPSC, SSC.',
          canonical: '/exams'
        };
        
      default:
        return base;
    }
  };

  return getMetaByPageType();
};