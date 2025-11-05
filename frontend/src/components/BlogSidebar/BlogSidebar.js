import React from 'react';
import { Link } from 'react-router-dom'
import about from '../../images/blog/about-widget.jpg'
import blogs from '../../api/blogs'

const SubmitHandler = (e) => {
    e.preventDefault()
}

const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const BlogSidebar = (props) => {
    return (
        <div className={`col col-lg-4 col-12 ${props.blLeft}`}>
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
                <div className="widget search-widget">
                    <h3>Search Here</h3>
                    <form onSubmit={SubmitHandler}>
                        <div>
                            <input type="text" className="form-control" placeholder="Search Post.." />
                            <button type="submit"><i className="ti-search"></i></button>
                        </div>
                    </form>
                </div>
                <div className="widget category-widget">
                    <h3>Post Categories</h3>
                    <ul>
                        <li><Link onClick={ClickHandler} to="/blog">Education<span>5</span></Link></li>
                        <li><Link onClick={ClickHandler} to="/blog">Ai Content <span>7</span></Link></li>
                        <li><Link onClick={ClickHandler} to="/blog">Knowledge<span>3</span></Link></li>
                        <li><Link onClick={ClickHandler} to="/blog">Marketing<span>6</span></Link></li>
                        <li><Link onClick={ClickHandler} to="/blog">Design<span>2</span></Link></li>
                        <li><Link onClick={ClickHandler} to="/blog">Courses<span>8</span></Link></li>
                    </ul>
                </div>
                <div className="widget recent-post-widget">
                    <h3>Related Posts</h3>
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
                <div className="widget tag-widget">
                    <h3>Tags</h3>
                    <ul>
                        <li><Link onClick={ClickHandler} to="/blog-single/Become-a-great-WordPress-&-PHP-developer.">Education</Link></li>
                        <li><Link onClick={ClickHandler} to="/blog-single/Become-a-great-WordPress-&-PHP-developer.">Marketing</Link></li>
                        <li><Link onClick={ClickHandler} to="/blog-single/Become-a-great-WordPress-&-PHP-developer.">Video</Link></li>
                        <li><Link onClick={ClickHandler} to="/blog-single/Become-a-great-WordPress-&-PHP-developer.">Knowledge</Link></li>
                        <li><Link onClick={ClickHandler} to="/blog-single/Become-a-great-WordPress-&-PHP-developer.">Design</Link></li>
                        <li><Link onClick={ClickHandler} to="/blog-single/Become-a-great-WordPress-&-PHP-developer.">SOCIAL</Link></li>
                        <li><Link onClick={ClickHandler} to="/blog-single/Become-a-great-WordPress-&-PHP-developer.">SECURITY</Link></li>
                        <li><Link onClick={ClickHandler} to="/blog-single/Become-a-great-WordPress-&-PHP-developer.">Web Design</Link></li>
                    </ul>
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

export default BlogSidebar;
