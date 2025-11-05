import React, { Fragment } from 'react';
import Navbar from '../../components/Navbar/Navbar'
import PageTitle from '../../components/pagetitle/PageTitle'
import Scrollbar from '../../components/scrollbar/scrollbar'
import { useParams } from 'react-router-dom'
import Events from '../../api/events'
import Footer from '../../components/footer/Footer';
import CoureseTab from './Tabs/CoureseTab';
import Sidebar from './sidebar';

const EventSinglePage = (props) => {
    const { slug } = useParams()

    const EventDetails = Events.find(item => item.slug === slug)

    return (
        <Fragment>
            <Navbar />
            <PageTitle pageTitle={EventDetails.title} pagesub={'Course'} />
            <div className="wpo-course-details-area section-padding">
                <div className="container">
                    <div className="row">
                        <div className="col col-lg-8">
                            <div className="wpo-course-details-wrap">
                                <div className="wpo-course-details-img">
                                    <img src={EventDetails.eSimg} alt="" />
                                </div>
                                <CoureseTab EventDetails={EventDetails} />
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
export default EventSinglePage;
