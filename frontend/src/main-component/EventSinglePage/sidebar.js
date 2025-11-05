import React from 'react'
import { Link } from 'react-router-dom'
import blogs from '../../api/blogs'
import about from '../../images/blog/about-widget.jpg'

const Sidebar = (props) => {

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <div className="col col-lg-4 col-12 course-sitebar">
            <div className="blog-sidebar">
                <div className="widget about-widget">
                    <div className="img-holder">
                        <img src={about} alt="" />
                    </div>
                    <h4>Jenny Watson</h4>
                    <p>Hi! beautiful people. I`m an authtor of this blog. Read our post - stay with us</p>
                    <div className="social">
                        <ul className="clearfix">
                            <li><Link onClick={ClickHandler} to="/blog-single/Letraset-Sheets-Passage-And-Recently"><i className="ti-facebook"></i></Link></li>
                            <li><Link onClick={ClickHandler} to="/blog-single/Letraset-Sheets-Passage-And-Recently"><i className="ti-twitter-alt"></i></Link></li>
                            <li><Link onClick={ClickHandler} to="/blog-single/Letraset-Sheets-Passage-And-Recently"><i className="ti-linkedin"></i></Link></li>
                            <li><Link onClick={ClickHandler} to="/blog-single/Letraset-Sheets-Passage-And-Recently"><i className="ti-pinterest"></i></Link></li>
                        </ul>
                    </div>
                </div>
                <div className="widget recent-post-widget">
                    <h3>Latest Course</h3>
                    <div className="posts">
                        {blogs.map((blog, bl) => (
                            <div className="post" key={bl}>
                                <div className="img-holder">
                                    <img src={blog.screens} alt="" />
                                </div>
                                <div className="details">
                                    <h4><Link onClick={ClickHandler} to={`/blog-single/${blog.slug}`}>{blog.title}</Link></h4>
                                    <span className="date">{blog.create_at}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="wpo-contact-widget widget">
                    <div className="wpo-contact-widget-inner">
                        <h2><Link onClick={ClickHandler} to="/contact">Contact For Advertisment 270 x 310</Link></h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;