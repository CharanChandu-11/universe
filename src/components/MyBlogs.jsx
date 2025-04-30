import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LoginContext } from '../contexts/loginContext';
import './MyBlogs.css'; // Assuming you have a CSS file for styling
const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(LoginContext);
  const navigate = useNavigate();

  // Get current user from session storage
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Fetch user's blogs
    const fetchMyBlogs = async () => {
      try {
        if (!currentUser || !currentUser.id) {
          throw new Error('User not found');
        }

        // Fetch all blogs first
        const response = await fetch('http://localhost:3001/blogs');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        
        const allBlogs = await response.json();
        
        // Filter blogs by the current user's ID
        const userBlogs = allBlogs.filter(blog => blog.authorId === currentUser.id);
        
        setBlogs(userBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, [isAuthenticated, navigate, currentUser.id]);

  const handleDelete = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3001/blogs/${blogId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete blog');
      }
      
      // Update state to remove the deleted blog
      setBlogs(blogs.filter(blog => blog.id !== blogId));
      
      // Show success alert
      const alertElement = document.createElement('div');
      alertElement.className = 'alert alert-success alert-dismissible fade show';
      alertElement.setAttribute('role', 'alert');
      alertElement.innerHTML = `
        Blog deleted successfully
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;
      document.querySelector('.container').prepend(alertElement);
      
      // Auto dismiss alert after 3 seconds
      setTimeout(() => {
        const alert = document.querySelector('.alert');
        if (alert) {
          alert.remove();
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog. Please try again.');
    }
  };

  const handleEdit = (blogId) => {
    // Navigate to edit page
    navigate(`/edit-blog/${blogId}`);
  };

  const handleCreateBlog = () => {
    navigate('/create-blog');
  };

  // Format date helper function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className=" mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading your blogs...</span>
        </div>
        <p className="mt-2">Loading your blogs...</p>
      </div>
    );
  }

  return (
    <div className="m-4 mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="aab">My Blogs</h2>
        <button className="btn btn-success" onClick={handleCreateBlog}>
          <i className="bi bi-plus-circle me-2"></i>Create New Blog
        </button>
      </div>

      {blogs.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          You haven't created any blogs yet. Start by creating your first blog!
        </div>
      ) : (
        <div className="row">
          {blogs.map(blog => (
            <div key={blog.id} className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                {blog.imageUrl && (
                  <img 
                    src={blog.imageUrl} 
                    className="card-img-top" 
                    alt={blog.title} 
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{blog.title}</h5>
                  <p className="card-text flex-grow-1">
                    {blog.content.length > 150
                      ? `${blog.content.substring(0, 150)}...`
                      : blog.content}
                  </p>
                  <div className="card-meta mb-3">
                    <div className="d-flex justify-content-between">
                      <span className="badge bg-secondary">{blog.department}</span>
                      <small className="text-muted">
                        Posted: {formatDate(blog.createdAt)}
                      </small>
                    </div>
                    <div className="d-flex gap-3 mt-2">
                      <small className="text-muted">
                        <i className="bi bi-hand-thumbs-up me-1"></i>
                        {blog.likes || 0} likes
                      </small>
                      <small className="text-muted">
                        <i className="bi bi-chat-text me-1"></i>
                        {blog.comments?.length || 0} comments
                      </small>
                    </div>
                  </div>
                  <div className="d-flex text-white justify-content-between">
                    <Link to={`/blog/${blog.id}`} className="btn  text-white btn-sm btn-outline-primary">
                      <i className="bi bi-eye me-1"></i>View
                    </Link>
                    <div>
                      <button 
                        className="btn text-white btn-sm btn-outline-secondary me-2" 
                        onClick={() => handleEdit(blog.id)}
                      >
                        <i className="bi bi-pencil me-1"></i>Edit
                      </button>
                      <button 
                        className="btn text-white btn-sm btn-outline-danger" 
                        onClick={() => handleDelete(blog.id)}
                      >
                        <i className="bi bi-trash me-1"></i>Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBlogs;