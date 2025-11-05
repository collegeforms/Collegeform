import React, {Fragment} from 'react';
import Navbar from '../../components/Navbar/Navbar'
import Hero3 from '../../components/hero3/hero3';
import Features2 from '../../components/Features2/Features2';
import About3 from '../../components/about3/about3';
import CategorySection3 from '../../components/CategorySection3/CategorySection3';
import CourseSection from '../../components/CourseSection/CourseSection';
import TeamSection from '../../components/TeamSection/TeamSection';
import EventSection from '../../components/EventSection/EventSection';
import BlogSection from '../../components/BlogSection/BlogSection';
import Newslatter from '../../components/Newslatter/Newslatter';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Footer from '../../components/footer/Footer';

const HomePage3 =() => {
    return(
        <Fragment>
            <Navbar hclass={'wpo-header-style-2'}/>
            <Hero3/>
            <Features2 fClass={'pb-0'}/>
            <About3/>
            <Newslatter/>
            <CategorySection3/>
            <CourseSection pClass={'wpo-popular-area-s2'}/>
            <TeamSection/>
            <EventSection/>
            <BlogSection/>
            <Footer/> 
            <Scrollbar/>
        </Fragment>
    )
};
export default HomePage3;