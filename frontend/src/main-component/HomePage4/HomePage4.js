import React, {Fragment} from 'react';
import Navbar from '../../components/Navbar/Navbar'
import Hero4 from '../../components/hero4/Hero4';
import About4 from '../../components/about4/about4';
import FunFact from '../../components/FunFact/FunFact';
import CategorySection2 from '../../components/CategorySection2/CategorySection2';
import CourseSection from '../../components/CourseSection/CourseSection';
import Testimonial from '../../components/Testimonial/Testimonial';
import BlogSection from '../../components/BlogSection/BlogSection';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Footer from '../../components/footer/Footer';

const HomePage4 =() => {
    return(
        <Fragment>
            <Navbar hclass={'wpo-header-style-3'}/>
            <Hero4/>
            <About4/>
            <FunFact/>
            <CategorySection2 cClass={'wpo-courses-section-s4'}/>
            <CourseSection pClass={'wpo-popular-area-s3'}/>
            <Testimonial tsClass={'wpo-testimonial-section-s2'}/>
            <BlogSection blClass={'wpo-blog-section-s2'}/>
            <Footer/> 
            <Scrollbar/>
        </Fragment>
    )
};
export default HomePage4;