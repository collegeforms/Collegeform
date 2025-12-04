import React, {Fragment} from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { useState, useEffect, useRef } from 'react';
import ApplyNowModal from '../router/components/ApplyNowModal';
import TextSlider from './TextSlider';
import Applycompo from './Applycompo';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import CategorySection from '../../components/CategorySection/CategorySection';
import CourseSection from '../../components/CourseSection/CourseSection';
import Testimonial from '../../components/Testimonial/Testimonial';
import ChooseSection from '../../components/ChooseSection/ChooseSection';
import MerittoLogin from '../router/components/MerittoLogin';
import { Helmet } from 'react-helmet';
import './home.css';
import Homeblogs from './Homeblogs';
import EducationBlocks from './EducationBlocks';
import Commonform from '../router/components/Commonform';
import PersonalisedSection from '../../components/PersonalisedSection/PersonalisedSection'
import FaqSection from '../FaqPage/FAQ';
import FAQ from '../FaqPage/FAQ';
import Banner from './Banner';

const HomePage = () => {

    const pageTitle = "India's most preferred and trusted online platform for discounted College Applications";
    const pageDescription = "Explore top colleges, best courses after 12th, MBA & BBA entrance exams, and get expert college admission help. Discover scholarships, discounts on forms, and college guidance at CollegeForms.in.";
    const pageUrl = "https://www.collegeforms.in/";
    const ogImage = "https://www.collegeforms.in/images/college-forms-og-image.jpg";

    return(
        <Fragment>
            <Helmet>
                <title>{pageTitle}</title>
                <meta name="description" content={pageDescription} />
                <meta name="keywords" content="best colleges in India, college admission help, MBA entrance exams, course selection guidance, tuition fee discounts, scholarships after 12th, scholarships on tuition fees" />
                
                <meta name="prerender-site-verification" content="UCGdsjfpoe18GbkVxeRa"/>
                {/* Canonical URL */}
                <link rel="canonical" href={pageUrl} />
                
                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={pageUrl} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={pageDescription} />
                <meta property="og:image" content={ogImage} />
                <meta property="og:site_name" content="CollegeForms.in" />
                
                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:url" content={pageUrl} />
                <meta name="twitter:title" content={pageTitle} />
                <meta name="twitter:description" content={pageDescription} />
                <meta name="twitter:image" content={ogImage} />
                
                {/* Additional Meta Tags */}
                <meta name="robots" content="index, follow" />
                <meta name="author" content="CollegeForms.in" />
                <meta name="publisher" content="CollegeForms.in" />
                
                {/* Structured Data */}
                <script type="application/ld+json">
                  {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": "CollegeForms.in",
                    "url": "https://www.collegeforms.in/",
                    "description": pageDescription,
                    "potentialAction": {
                      "@type": "SearchAction",
                      "target": "https://www.collegeforms.in/search?q={search_term_string}",
                      "query-input": "required name=search_term_string"
                    }
                  })}
                </script>
            </Helmet>
            
            <Navbar hclass={'wpo-header-style-4'}/>
            <div className='mobile-slider '>
                <TextSlider />
            </div>

            <div className='dextop-slider'>
                <TextSlider />
            </div>
            
            <div className="home-content-wrapper">
                <div className="applycompo-mobile">
                    <Applycompo/>
                </div>


                {/* <Banner/ */}
                <MerittoLogin/>
            </div>

            <br/>
            <br/>

            <CategorySection/>
            <EducationBlocks/>
            <CourseSection/>
            <Commonform/>
            <Testimonial/>
            <ChooseSection/>
            <FAQ/>
            <PersonalisedSection/>
            <Homeblogs/>
            <Footer/> 
            <Scrollbar/>

     
        </Fragment>
    )
};

export default HomePage;