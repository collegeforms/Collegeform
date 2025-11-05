import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import CategorySection from '../../components/CategorySection/CategorySection';
import Newslatter2 from '../../components/Newslatter2/Newslatter2';
import Scrollbar from '../../components/scrollbar/scrollbar'
import Footer from '../../components/footer/Footer';

const CoursePageS2 = () => {
    return (
        <Fragment>
            <Navbar />
            <PageTitle pageTitle={'Course'} pagesub={'Course'} />
            <CategorySection cClass={'bg-white'}/>
            <Newslatter2/>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default CoursePageS2;
