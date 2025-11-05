import React, { Fragment } from 'react';
import video from '../../images/video/html.mp4'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom'


const LessonPage = () => {

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <Fragment>
            <section className="wpo-lesson-section">
                <h2 className="hidden">hidden</h2>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col col-xl-3 col-lg-4 col-12">
                            <div className="wpo-lesson-sidebar">
                                <div className="accordion-item">
                                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                                        <AccordionSummary
                                            aria-controls="panel1bh-content"
                                            id="panel1bh-header"
                                        >
                                            <Typography>1. Course Intrduction <span>1/6</span></Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                <div className="accordion-body">
                                                    <ul className="item">
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.1<i
                                                            className="fi flaticon-play-button"></i>Introduction of
                                                            Language</span> <span>20 min<i className="fa fa-check-circle"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.2<i
                                                            className="fi flaticon-play-button"></i>Introduction of HTML
                                                            Editors</span> <span>30 min<i className="fa fa-check-circle"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.3<i
                                                            className="fi flaticon-play-button"></i>Introduction of
                                                            Basic</span> <span>15 min<i className="fa fa-check-circle"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.4<i
                                                            className="fi flaticon-play-button"></i>Introduction of
                                                            Style</span> <span><i className="fa fa-circle-thin"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.5<i
                                                            className="fi flaticon-play-button"></i>Introduction of
                                                            Start</span> <span><i className="fa fa-circle-thin"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.6<i
                                                            className="fi flaticon-play-button"></i>Introduction of
                                                            Oparator</span> <span><i className="fa fa-circle-thin"
                                                                aria-hidden="true"></i></span></Link></li>
                                                    </ul>
                                                </div>
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                                <div className="accordion-item">
                                    <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                                        <AccordionSummary
                                            aria-controls="panel2bh-content"
                                            id="panel2bh-header"
                                        >
                                            <Typography>2. HTML Basic <span>1/5</span></Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                <div className="accordion-body">
                                                    <ul className="item">
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.1<i className="fi flaticon-play-button"></i>HTML
                                                            Elements</span> <span>20 min<i className="fa fa-check-circle"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.2<i className="fi flaticon-play-button"></i>HTML
                                                            Attributes</span> <span>25 min<i className="fa fa-check-circle"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.3<i className="fi flaticon-play-button"></i>HTML
                                                            Headings</span> <span>30 min<i className="fa fa-check-circle"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.4<i className="fi flaticon-play-button"></i>HTML
                                                            Paragraphs</span> <span><i className="fa fa-circle-thin"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.5<i className="fi flaticon-play-button"></i>HTML
                                                            Styles</span> <span><i className="fa fa-circle-thin"
                                                                aria-hidden="true"></i></span></Link></li>
                                                    </ul>
                                                </div>
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                                <div className="accordion-item">
                                    <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                                        <AccordionSummary
                                            aria-controls="panel3bh-content"
                                            id="panel3bh-header"
                                        >
                                            <Typography>3. HTML Elements <span>1/5</span></Typography>

                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                <div className="accordion-body">
                                                    <ul className="item">
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.1<i className="fi flaticon-play-button"></i>HTML
                                                            Text Formatting</span> <span>20 min<i
                                                                className="fa fa-check-circle"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.2<i className="fi flaticon-play-button"></i>HTML
                                                            Quotation</span> <span>25 min<i className="fa fa-check-circle"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.3<i className="fi flaticon-play-button"></i>HTML
                                                            Comments</span> <span>30 min<i className="fa fa-check-circle"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.4<i className="fi flaticon-play-button"></i>HTML
                                                            Colors</span> <span><i className="fa fa-circle-thin"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.5<i className="fi flaticon-play-button"></i>HTML
                                                            Styles - CSS</span> <span><i className="fa fa-circle-thin"
                                                                aria-hidden="true"></i></span></Link></li>
                                                    </ul>
                                                </div>
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                                <div className="accordion-item">
                                    <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                                        <AccordionSummary
                                            aria-controls="panel4bh-content"
                                            id="panel4bh-header"
                                        >
                                            <Typography>4. HTML Advanced Elements <span>1/5</span></Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                <div className="accordion-body">
                                                    <ul className="item">
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.1<i className="fi flaticon-play-button"></i>HTML
                                                            Elements</span> <span>20 min<i className="fa fa-check-circle"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.2<i className="fi flaticon-play-button"></i>HTML
                                                            Attributes</span> <span>25 min<i className="fa fa-check-circle"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.3<i className="fi flaticon-play-button"></i>HTML
                                                            Headings</span> <span>30 min<i className="fa fa-check-circle"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.4<i className="fi flaticon-play-button"></i>HTML
                                                            Paragraphs</span> <span><i className="fa fa-circle-thin"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.5<i className="fi flaticon-play-button"></i>HTML
                                                            Styles</span> <span><i className="fa fa-circle-thin"
                                                                aria-hidden="true"></i></span></Link></li>
                                                    </ul>
                                                </div>
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                                <div className="accordion-item">
                                    <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
                                        <AccordionSummary
                                            aria-controls="panel5bh-content"
                                            id="panel5bh-header"
                                        >
                                            <Typography>5. Basic Style Css <span>1/5</span></Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography>
                                                <div className="accordion-body">
                                                    <ul className="item">
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.1<i className="fi flaticon-play-button"></i>CSS
                                                            Introduction</span> <span>20 min<i
                                                                className="fa fa-check-circle"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.2<i className="fi flaticon-play-button"></i>CSS
                                                            Syntax</span> <span>25 min<i className="fa fa-check-circle"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.3<i className="fi flaticon-play-button"></i>CSS
                                                            Selectors</span> <span>30 min<i className="fa fa-check-circle"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.4<i className="fi flaticon-play-button"></i>CSS
                                                            Comments</span> <span><i className="fa fa-circle-thin"
                                                                aria-hidden="true"></i></span></Link></li>
                                                        <li><Link onClick={ClickHandler} to="/lesson"><span>1.5<i className="fi flaticon-play-button"></i>CSS
                                                            Backgrounds</span> <span><i className="fa fa-circle-thin"
                                                                aria-hidden="true"></i></span></Link></li>
                                                    </ul>
                                                </div>
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                            </div>
                        </div>
                        <div className="col col-xl-9 col-lg-8 col-12">
                            <div className="video-area">
                                <div className="video-heading">
                                    <h2>1.1 Introduction of Language</h2>
                                    <Link onClick={ClickHandler} className="theme-btn" to="/">Back To Home</Link>
                                </div>
                                <video autoPlay muted poster={video} loop>
                                    <source
                                        src={video}
                                        type="video/mp4"
                                    />
                                </video>
                                <div className="video-details">
                                    <h2>About Lesson</h2>
                                    <p>On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire</p>
                                </div>
                                <div className="video-details-pagination">
                                    <ul>
                                        <li><Link onClick={ClickHandler} to="/lesson">Previews</Link></li>
                                        <li><Link onClick={ClickHandler} to="/lesson">Next</Link></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Fragment>
    )
};
export default LessonPage;
