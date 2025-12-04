import { Helmet } from 'react-helmet-async';

const DefaultSEO = () => {
    return (
        <Helmet>
            {/* Default meta tags for the entire site */}
            <title>CollegeForms.in - India's most preferred and trusted online platform for discounted College Applications</title>
            <meta name="description" content="Explore top colleges, best courses after 12th, MBA & BBA entrance exams, and get expert college admission help. Discover scholarships, discounts on forms, and college guidance at CollegeForms.in." />
            <meta name="keywords" content="best colleges in India, college admission help, MBA entrance exams, course selection guidance, tuition fee discounts, scholarships after 12th, scholarships on tuition fees" />
            
            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://www.collegeforms.in/" />
            <meta property="og:title" content="India's most preferred and trusted online platform for discounted College Applications" />
            <meta property="og:description" content="Explore top colleges, best courses after 12th, MBA & BBA entrance exams, and get expert college admission help at CollegeForms.in." />
            <meta property="og:image" content="/college-forms-og-image.jpg" />
            
            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content="https://www.collegeforms.in/" />
            <meta name="twitter:title" content="India's most preferred and trusted online platform for discounted College Applications" />
            <meta name="twitter:description" content="Get expert college admission help, scholarships and discounts on forms at CollegeForms.in" />
            <meta name="twitter:image" content="/college-forms-twitter-card.jpg" />
            
            {/* Canonical */}
            <link rel="canonical" href="https://www.collegeforms.in/" />
        </Helmet>
    );
};

export default DefaultSEO;