import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogSidebar from '../BlogSidebar/BlogSidebar.js';
import axios from 'axios';

const ClickHandler = () => {
  window.scrollTo(10, 0);
}

const BlogList = (props) => {
  const API_URL = "https://www.collegeforms.in";
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
        
        // 添加 status 参数，只获取已发布的博客
        params.append('status', 'published');
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }
        
        const response = await axios.get(url);
        console.log(response.data.blogs);
        
        // 也可以在客户端进行额外的过滤（双重保障）
        const publishedBlogs = response.data.blogs.filter(blog => blog.status === 'published');
        
        setBlogs(publishedBlogs);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching blogs:", err);
      }
    };

    fetchBlogs();
  }, [props.category, props.featured, API_URL]);

  if (loading) {
    return <div className="wpo-blog-pg-section section-padding">Loading blogs...</div>;
  }

  if (error) {
    return <div className="wpo-blog-pg-section section-padding">Error: {error}</div>;
  }

  // 如果过滤后没有博客
  if (blogs.length === 0) {
    return (
      <section className="wpo-blog-pg-section ">
        <br/>
        <br/>
        <div className="container">
          <div className="row">
            <div className="col col-12">
              <div className="wpo-blog-content">
                <div className="text-center">
                  <h4>No published blogs available</h4>
                  <p>Check back later for new content!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="wpo-blog-pg-section ">
      <br/>
      <br/>
      <div className="container">
        <div className="row">
          {blogs.map((blog, bitem) => (
            <div className={`col col-lg-4 col-12 `} key={blog._id || bitem}>
              <div className="wpo-blog-content">
                <div className={`post ${blog.blClass}`}>
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
                    <Link onClick={ClickHandler} to={`/blogs/${blog.slug}`} className="read-more">READ MORE...</Link>
                  </div>
                </div>
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