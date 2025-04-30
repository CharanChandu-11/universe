import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./BlogDetails.css";

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  // Get current user from session storage
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || {};
  const isAuthor = blog?.authorId === currentUser?.id;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        // Fetch the blog from db.json using fetch API
        const response = await fetch(`http://localhost:3001/blogs/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Blog not found");
          }
          throw new Error("Failed to fetch blog");
        }
        
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!currentUser.id) {
      alert("Please log in to add a comment");
      navigate("/login");
      return;
    }
    
    if (!comment.trim()) {
      return;
    }
    
    try {
      setIsSubmittingComment(true);
      
      // First, get the current blog data
      const blogResponse = await fetch(`http://localhost:3001/blogs/${id}`);
      if (!blogResponse.ok) {
        throw new Error("Failed to fetch current blog data");
      }
      const currentBlog = await blogResponse.json();
      
      const newComment = {
        id: Date.now().toString(),
        text: comment,
        authorId: currentUser.id,
        authorName: `${currentUser.firstName} ${currentUser.lastName}`,
        createdAt: new Date().toISOString()
      };
      
      const updatedComments = [...(currentBlog.comments || []), newComment];
      
      // Update the blog with new comments
      const updateResponse = await fetch(`http://localhost:3001/blogs/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          comments: updatedComments
        })
      });
      
      if (!updateResponse.ok) {
        throw new Error("Failed to add comment");
      }
      
      const updatedBlog = await updateResponse.json();
      setBlog(updatedBlog);
      setComment("");
      
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser.id) {
      alert("Please log in to like this blog");
      navigate("/login");
      return;
    }
    
    try {
      // First, get current blog data to ensure we have the latest like count
      const blogResponse = await fetch(`http://localhost:3001/blogs/${id}`);
      if (!blogResponse.ok) {
        throw new Error("Failed to fetch current blog data");
      }
      const currentBlog = await blogResponse.json();
      
      // Update like count
      const updateResponse = await fetch(`http://localhost:3001/blogs/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          likes: (currentBlog.likes || 0) + 1
        })
      });
      
      if (!updateResponse.ok) {
        throw new Error("Failed to like blog");
      }
      
      const updatedBlog = await updateResponse.json();
      setBlog(updatedBlog);
      
    } catch (error) {
      console.error("Error liking blog:", error);
      alert("Failed to like blog. Please try again.");
    }
  };

  const handleDeleteBlog = async () => {
    if (!isAuthor) {
      return;
    }
    
    if (!window.confirm("Are you sure you want to delete this blog?")) {
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:3001/blogs/${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }
      
      alert("Blog deleted successfully");
      navigate("/blog");
      
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog. Please try again.");
    }
  };

  // Format date helper function
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return <div className="loading">Loading blog...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <Link to="/blog" className="back-to-blogs">
          Back to Blogs
        </Link>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="error-container">
        <div className="error">Blog not found</div>
        <Link to="/blog" className="back-to-blogs">
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="blog-details">
      <div className="blog-nav">
        <Link to="/blog" className="back-link">
          ← Back to Blogs
        </Link>
        {isAuthor && (
          <div className="author-actions">
            <Link to={`/edit-blog/${id}`} className="edit-link">
              Edit
            </Link>
            <button className="delete-link" onClick={handleDeleteBlog}>
              Delete
            </button>
          </div>
        )}
      </div>

      <article className="blog-article">
        <header className="blog-header">
          <div className="blog-meta">
            <span className="blog-department">{blog.department}</span>
            <span className="blog-date">{formatDate(blog.createdAt)}</span>
          </div>
          <h1 className="blog-title">{blog.title}</h1>
          <div className="blog-author">
            <span>By {blog.authorName}</span>
          </div>
        </header>

        {blog.imageUrl && (
          <div className="blog-feature-image">
            <img src={blog.imageUrl} alt={blog.title} />
          </div>
        )}

        <div className="blog-content">
          {blog.content.split('\n').map((paragraph, idx) => (
            paragraph ? <p key={idx}>{paragraph}</p> : <br key={idx} />
          ))}
        </div>

        <div className="blog-actions">
          <button className="like-button" onClick={handleLike}>
            <span className="like-icon">❤️</span>
            <span>{blog.likes || 0} likes</span>
          </button>
        </div>
      </article>

      <section className="comments-section">
        <h2>Comments ({blog.comments?.length || 0})</h2>
        
        {currentUser.id && (
          <form className="comment-form" onSubmit={handleAddComment}>
            <textarea
              placeholder="Add a comment..."
              value={comment}
              onChange={handleCommentChange}
              required
            ></textarea>
            <button 
              type="submit" 
              disabled={isSubmittingComment || !comment.trim()}
            >
              {isSubmittingComment ? "Posting..." : "Post Comment"}
            </button>
          </form>
        )}
        
        {!currentUser.id && (
          <div className="login-to-comment">
            <Link to="/login">Log in</Link> to add a comment.
          </div>
        )}
        
        <div className="comments-list">
          {blog.comments && blog.comments.length > 0 ? (
            blog.comments.map((comment) => (
              <div className="comment" key={comment.id}>
                <div className="comment-header">
                  <span className="comment-author">{comment.authorName}</span>
                  <span className="comment-date">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="comment-text">{comment.text}</p>
              </div>
            ))
          ) : (
            <p className="no-comments">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogDetails;