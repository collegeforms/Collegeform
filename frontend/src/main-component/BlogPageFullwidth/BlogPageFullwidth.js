import React, {Fragment} from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PageTitle from '../../components/pagetitle/PageTitle'
import BlogList from '../../components/BlogList/BlogList.js'
import Scrollbar from '../../components/scrollbar/scrollbar'
import Footer from '../../components/footer/Footer';
import FaqSection from '../FaqPage/FAQ';

const BlogPageFullwidth =() => {
    return(
        <Fragment>
            <Navbar/>
            <PageTitle pageTitle={'Latest News'} pagesub={'Blog'}/> 
            <BlogList blLeft={'d-none'} blRight={'col-lg-12 offset-lg-1'}/>
            <FaqSection/>
            <Footer/>
            <Scrollbar/>
        </Fragment>
    )
};
export default BlogPageFullwidth;

