import React from "react";
import { Link } from 'react-router-dom'
import Events from '../../api/events'
import cImag from '../../images/testimonial/shape-1.png'
import cImag2 from '../../images/testimonial/shape-2.png'


const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const EventSection = (props) => {
    return (
        <div className="wpo-event-area section-padding">
            <div className="container">
                <div className="wpo-section-title-s2">
                    <small>Our Events</small>
                    <h2>Next Upcoming Events</h2>
                </div>
                <div className="wpo-event-wrap">
                    <div className="row">
                        {Events.map((event, evt) => (
                            <div className="col col-lg-4 col-md-6 col-12" key={evt}>
                                <div className="wpo-event-item">
                                    <div className="wpo-event-img">
                                        <img src={event.eImg} alt="" />
                                        <div className="thumb">
                                            <h5>{event.month}</h5>
                                            <span>{event.date}</span>
                                        </div>
                                    </div>
                                    <div className="wpo-event-content">
                                        <ul>
                                            <li><i className="fi fa fa-clock-o" aria-hidden="true"></i>{event.time}</li>
                                            <li><i className="fi flaticon-placeholder"></i>{event.location}</li>
                                        </ul>
                                        <h2><Link onClick={ClickHandler} to={`/event-single/${event.slug}`}>{event.title}</Link></h2>
                                        <Link onClick={ClickHandler} to={`/event-single/${event.slug}`} className="more">Book A Seat</Link>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
            <div className="shape-1"><img src={cImag} alt=""/></div>
            <div className="shape-2"><img src={cImag2} alt=""/></div>
        </div>
    );
}

export default EventSection;