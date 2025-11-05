import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import CategorySection2 from '../../components/CategorySection2/CategorySection2';
import Newslatter2 from '../../components/Newslatter2/Newslatter2';
import Scrollbar from '../../components/scrollbar/scrollbar'
import Footer from '../../components/footer/Footer';

const CoursePageS3 = () => {
    return (
        <Fragment>
            <Navbar />
            <PageTitle pageTitle={'Course'} pagesub={'Course'} />
            <CategorySection2 cClass={'bg-white'}/>
            <Newslatter2/>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default CoursePageS3;
