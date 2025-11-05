import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import PortfolioSection from '../../components/PortfolioSection';
import Scrollbar from '../../components/scrollbar/scrollbar'
import Footer from '../../components/footer/Footer';
import Newslatter from '../../components/Newslatter/Newslatter';

const GalleryPage = () => {
    return (
        <Fragment>
            <Navbar />
            <PageTitle pageTitle={'Gallery'} pagesub={'Gallery'} />
            <PortfolioSection/>
            <Newslatter/>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default GalleryPage;
