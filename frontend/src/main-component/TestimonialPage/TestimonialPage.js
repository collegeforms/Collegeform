import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import Testimonial from '../../components/Testimonial/Testimonial';
import Scrollbar from '../../components/scrollbar/scrollbar'
import Footer from '../../components/footer/Footer';
import Newslatter from '../../components/Newslatter/Newslatter';

const TestimonialPage = () => {
    return (
        <Fragment>
            <Navbar />
            <PageTitle pageTitle={'Testimonial'} pagesub={'Testimonial'} />
            <Testimonial tsClass={'bg-white'}/>
            <Newslatter/>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default TestimonialPage;

