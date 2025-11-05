import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import CourseSectionS3 from '../../components/CourseSectionS3/CourseSectionS3';
import Newslatter2 from '../../components/Newslatter2/Newslatter2';
import Scrollbar from '../../components/scrollbar/scrollbar'
import Footer from '../../components/footer/Footer';

const CoursePage = () => {
    return (
        <Fragment>
            <Navbar />
            <PageTitle pageTitle={'Course'} pagesub={'Course'} />
            <CourseSectionS3/>
            <Newslatter2/>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default CoursePage;
