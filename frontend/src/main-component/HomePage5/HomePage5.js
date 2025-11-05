import React, {Fragment} from 'react';
import Navbar from '../../components/Navbar/Navbar'
import Hero5 from '../../components/hero5/Hero5';
import Features2 from '../../components/Features2/Features2';
import About5 from '../../components/about5/about5';
import FunFact2 from '../../components/FunFact2/FunFact2';
import CategorySection from '../../components/CategorySection/CategorySection';
import CourseSectionS2 from '../../components/CourseSectionS2/CourseSectionS2';
import TeamSection from '../../components/TeamSection/TeamSection';
import BlogSection from '../../components/BlogSection/BlogSection';
import Newslatter2 from '../../components/Newslatter2/Newslatter2';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Footer from '../../components/footer/Footer';

const HomePage5 =() => {
    return(
        <Fragment>
            <Navbar hclass={'wpo-header-style-2'}/>
            <Hero5/>
            <Features2 fClass={'wpo-features-area-s3 p-0'}/>
            <About5/>
            <FunFact2/>
            <CategorySection cClass={'wpo-courses-section-s5'}/>
            <CourseSectionS2/>
            <TeamSection/>
            <Newslatter2/>
            <BlogSection/>
            <Footer/> 
            <Scrollbar/>
        </Fragment>
    )
};
export default HomePage5;