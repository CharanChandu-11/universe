import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AllBlogs.css"; // You'll need to create this CSS file

const AllBlogs = () => {
  const API_URL = "http://localhost:3001";
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/blogs`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [API_URL]);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to truncate content for preview
  const truncateContent = (content, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substr(0, maxLength) + '...';
  };

  if (isLoading) return (
    <div className="mt-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading blogs...</span>
      </div>
      <p className="mt-2">Loading blogs...</p>
    </div>
  );
  
  if (error) return (
    <div className="mt-5">
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    </div>
  );

  return (
    <div className="all-blogs-container  py-5">
      <header className="text-center mb-5">
        <h1 className="display-4 abc">UniVerse Blogs</h1>
        <p className="lead text-muted">Discover insights and knowledge from across the campus</p>
      </header>

      <div className="row">
        {blogs.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info" role="alert">
              No blogs have been published yet.
            </div>
          </div>
        ) : (
          blogs.map(blog => (
            <div className="col-md-6 col-lg-4 mb-4" key={blog.id}>
              <div className="card h-100 ">
                {blog.imageUrl && (
                  <img 
                    src={blog.imageUrl} 
                    className="card-img-top" 
                    alt={blog.title}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between mb-2">
                    <div>
                      {blog.department && <span className="badge bg-primary me-1">{blog.department}</span>}
                      {blog.club && <span className="badge bg-success">{blog.club}</span>}
                    </div>
                    <small className="text-muted">{formatDate(blog.createdAt)}</small>
                  </div>
                  <h5 className="card-title">{blog.title}</h5>
                  <p className="card-text flex-grow-1">{truncateContent(blog.content)}</p>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <small className="text-muted">By {blog.authorName}</small>
                    <Link to={`/blog/${blog.id}`} className="btn btn-sm text-white btn-outline-primary">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllBlogs;