import React from "react";
import blogs from '../../api/blogs'
import { Link } from "react-router-dom";


const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const BlogSection = (props) => {
    return (
        <section className={`wpo-blog-section section-padding ${props.blClass}`} id="blog">
            <div className="container">
                <div className="wpo-section-title-s2">
                    <small>Our Blogs</small>
                    <h2>Our Latest
                        <span>
                            News
                            <i className="shape">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 145 46" fill="none">
                                    <path d="M107.465 1.86127C76.1791 0.382526 38.7504 4.96662 14.9904 15.9301C10.0768 18.3284 5.60658 21.239 4.02647 24.6787C3.01875 26.8853 3.55285 29.2555 5.43123 31.2976C10.5101 36.6231 22.5846 39.2515 33.0488 40.9198C55.2972 44.1564 80.2705 44.7874 102.739 41.8008C118.066 39.7753 141.703 34.179 140.808 24.5547C140.204 17.1246 127.418 12.3312 115.089 9.75066C97.6052 6.12775 78.4767 4.84999 59.7231 4.73023C50.3634 4.72086 41.0218 5.59353 32.2486 7.27637C23.6649 8.96547 15.0207 11.3346 8.94011 14.9585C7.92634 15.575 6.09028 14.8482 7.05971 14.1723C14.6519 9.42888 26.8493 6.35997 38.1015 4.63859C54.4587 2.1466 71.852 2.88389 88.5096 4.09708C111.691 5.94655 146.566 11.4064 144.712 26.45C143.795 31.1206 137.533 34.9767 130.415 37.6353C110.558 44.8114 84.1139 46.4849 60.4708 45.4737C46.0201 44.7937 31.4122 43.4295 18.3582 39.9878C8.05936 37.2584 -0.729958 32.6399 0.0480004 26.2449C1.51121 16.9861 22.238 10.0849 37.1582 6.58074C50.3473 3.49934 64.4997 1.55302 78.8596 0.693895C88.431 0.125308 98.1292 0.0763642 107.715 0.617875C108.378 0.655364 108.857 0.963609 108.785 1.30726C108.714 1.64779 108.124 1.89459 107.465 1.86127Z" />
                                </svg>
                            </i>
                        </span>
                    </h2>
                </div>
                <div className="wpo-blog-items">
                    <div className="row">
                        {blogs.map((blog, bl) => (
                            <div className="col col-lg-4 col-md-6 col-12" key={bl}>
                                <div className="wpo-blog-item">
                                    <div className="wpo-blog-img">
                                        <img src={blog.screens} alt="" />
                                    </div>
                                    <div className="wpo-blog-content">
                                        <ul>
                                            <li>{blog.create_at}</li>
                                            <li>By <Link onClick={ClickHandler} to={`/blog-single/${blog.slug}`}>{blog.author}</Link></li>
                                        </ul>
                                        <h2><Link onClick={ClickHandler} to={`/blog-single/${blog.slug}`}>{blog.title}</Link>
                                        </h2>
                                        <Link onClick={ClickHandler} to={`/blog-single/${blog.slug}`} className="more">Continue Reading</Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BlogSection;