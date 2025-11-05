import React from 'react'
import { Link } from 'react-router-dom'
import blogs from '../../api/blogs'

const Sidebar = (props) => {

    const ClickHandler = () => {
        window.scrollTo(10, 0);
    }

    return (
        <div className="col col-lg-4 col-12 course-sitebar">
            <div className="blog-sidebar">
                <div className="widget features-widget">
                    <div className="features-top">
                        <h4>$80.20 <del>$94.99</del></h4>
                        <span> 5 days left!</span>
                    </div>
                    <div className="cart-btn">
                        <Link onClick={ClickHandler} to="/cart" className="theme-btn-s3">Add to Cart</Link>
                    </div>
                    <ul>
                        <li>Duration: <span>20 Hours</span></li>
                        <li>Lessons: <span>24</span></li>
                        <li>Videos <span>10 Hours</span></li>
                        <li>Students: <span>Max 100</span></li>
                        <li>Language: <span>English</span></li>
                        <li>Skill Level <span>Advanced</span></li>
                    </ul>
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
            </div>
        </div>
    )
}

export default Sidebar;