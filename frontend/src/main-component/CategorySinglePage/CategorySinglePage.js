import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import Scrollbar from '../../components/scrollbar/scrollbar'
import { useParams } from 'react-router-dom'
import CoursesCategory from '../../api/CoursesCategory'
import Footer from '../../components/footer/Footer';
import CoureseTab from './Tabs/CoureseTab';
import Sidebar from './sidebar';

const CategorySinglePage = (props) => {
    const { slug } = useParams()

    const CoursesCategoryDetails = CoursesCategory.find(item => item.slug === slug)

    return (
        <Fragment>
            <Navbar />
            <PageTitle pageTitle={CoursesCategoryDetails.title} pagesub={'Course'} />
            <div className="wpo-course-details-area section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col col-lg-8">
                            <div className="wpo-course-details-wrap">
                                <div className="wpo-course-details-img">
                                    <img src={CoursesCategoryDetails.cImg} alt="" />
                                </div>
                                <CoureseTab CoursesCategoryDetails={CoursesCategoryDetails} />
                            </div>
                        </div>
                        <Sidebar />
                    </div>
                </div>
            </div>
            <Footer />
            <Scrollbar />
        </Fragment>
    )
};
export default CategorySinglePage;
