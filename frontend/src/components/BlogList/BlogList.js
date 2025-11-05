import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogSidebar from '../BlogSidebar/BlogSidebar.js';
import axios from 'axios';

const ClickHandler = () => {
  window.scrollTo(10, 0);
}

const BlogList = (props) => {
  const API_URL = "https://collegeform.onrender.com" || "https://collegeform-production.up.railway.app" || "http://localhost:5000";

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Construct query parameters based on props if needed
        let url = `${API_URL}/api/blogs`;
        const params = new URLSearchParams();
        
        if (props.category) {
          params.append('category', props.category);
        }
        
        if (props.featured) {
          params.append('featured', true);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await axios.get(url);
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching blogs:", err);
      }
    };

    fetchBlogs();
  }, [props.category, props.featured, API_URL]); // Added API_URL to dependencies

  if (loading) {
    return <div className="wpo-blog-pg-section section-padding">Loading blogs...</div>;
  }

  if (error) {
    return <div className="wpo-blog-pg-section section-padding">Error: {error}</div>;
  }
  console.log(blogs);
  

  return (
    <section className="wpo-blog-pg-section ">
      <br/>
      <br/>

      <div className="container">
        <div className="row">
              {blogs.map((blog, bitem) => (

          <div className={`col col-lg-4 col-12 `}>
            <div className="wpo-blog-content">
                <div className={`post ${blog.blClass}`} key={bitem}>
                  <div className="entry-media video-holder">
                    <img src={blog.image} alt={blog.title} />
                  </div>
                  <div className="entry-meta">
                    <ul>
                      <li><i className="fi flaticon-user"></i> By <Link onClick={ClickHandler} to={`/blog-single/${blog.slug}`}>{blog.authorTitle}</Link> </li>
                      <li><i className="fi flaticon-comment-white-oval-bubble"></i> Comments {blog.comment} </li>
                      <li><i className="fi flaticon-calendar"></i> {new Date(blog.createdAt).toLocaleDateString()}</li>
                    </ul>
                  </div>
                  <div className="entry-details">
                    <h6><Link className='text-dark' onClick={ClickHandler} to={`/blogs/${blog.slug}`}>{blog.title}</Link></h6>
                    {/* <p>{blog.excerpt || "Law is a great career path if you want to build a broad skill set that includes everything from critical thinking and strategic planning to communications. If you love rising to a challenge."}</p> */}
                    <Link onClick={ClickHandler} to={`/blogs/${blog.slug}`} className="read-more">READ MORE...</Link>
                  </div>
                </div>

              {/* <div className="pagination-wrapper pagination-wrapper-left">
                <ul className="pg-pagination">
                  <li>
                    <Link to="/blog-left-sidebar" aria-label="Previous">
                      <i className="fi ti-angle-left"></i>
                    </Link>
                  </li>
                  <li className="active"><Link to="/blog-left-sidebar">1</Link></li>
                  <li><Link to="/blog-left-sidebar">2</Link></li>
                  <li><Link to="/blog-left-sidebar">3</Link></li>
                  <li>
                    <Link to="/blog-left-sidebar" aria-label="Next">
                      <i className="fi ti-angle-right"></i>
                    </Link>
                  </li>
                </ul>
              </div> */}
            </div>
          </div>
              ))}

          <BlogSidebar blLeft={props.blLeft} />
        </div>
      </div>
    </section>
  );
}

export default BlogList;