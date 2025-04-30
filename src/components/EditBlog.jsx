import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoginContext } from '../contexts/loginContext';

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(LoginContext);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [club, setClub] = useState('');
  const [contentType, setContentType] = useState('department'); // 'department' or 'club'
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Get current user from session storage
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || {};

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:3001/blogs/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Blog not found');
          }
          throw new Error('Failed to fetch blog');
        }

        const data = await response.json();

        // Check if current user is the author
        if (data.authorId !== currentUser.id) {
          navigate('/my-blogs');
          return;
        }

        setTitle(data.title);
        setContent(data.content);
        setImageUrl(data.imageUrl || '');
        
        if (data.department) {
          setDepartment(data.department);
          setContentType('department');
        } else if (data.club) {
          setClub(data.club);
          setContentType('club');
        }
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id, isAuthenticated, navigate, currentUser.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    if (contentType === 'department' && !department) {
      setError('Please select a department');
      return;
    }

    if (contentType === 'club' && !club) {
      setError('Please select a club');
      return;
    }

    try {
      setIsSubmitting(true);

      const updatedBlog = {
        title,
        content,
        imageUrl: imageUrl || null,
        department: contentType === 'department' ? department : null,
        club: contentType === 'club' ? club : null,
        updatedAt: new Date().toISOString()
      };

      const response = await fetch(`http://localhost:3001/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedBlog)
      });

      if (!response.ok) {
        throw new Error('Failed to update blog');
      }

      // Navigate to my blogs page after successful update
      navigate('/my-blogs');

    } catch (error) {
      console.error('Error updating blog:', error);
      setError('Failed to update blog. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/my-blogs');
  };

  if (isLoading) {
    return (
      <div className="mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading blog...</span>
        </div>
        <p className="mt-2">Loading blog...</p>
      </div>
    );
  }

  if (error && isLoading) {
    return (
      <div className="mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <div className="text-center mt-3">
          <button onClick={() => navigate('/my-blogs')} className="btn btn-secondary">
            Back to My Blogs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
          <div
  className="card-header text-white p-3 "
  style={{ backgroundImage: 'linear-gradient(to left, #493240, #FF0099)' }}
>
              <h3 className="mb-0">Edit Blog</h3>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <strong>Error!</strong> {error}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setError(null)} 
                    aria-label="Close"
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control bg-white text-dark border border-secondary shadow-sm"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter blog title"
                    required
                  />
                </div>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label mb-0">Content Type</label>
                    <div className="btn-group btn-group-sm" role="group">
                      <button
                        type="button"
                        className={`btn ${contentType === 'department' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setContentType('department')}
                      >
                        Department
                      </button>
                      <button
                        type="button"
                        className={`btn ${contentType === 'club' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setContentType('club')}
                      >
                        Club
                      </button>
                    </div>
                  </div>

                  {contentType === 'department' ? (
                    <select
                      className="form-select bg-white text-dark border border-secondary shadow-sm"
                      id="department"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      <option value="CSE">Computer Science Engineering (CSE)</option>
                      <option value="IT">Information Technology (IT)</option>
                      <option value="MECH">Mechanical Engineering (MECH)</option>
                      <option value="ECE">Electronics & Communication (ECE)</option>
                      <option value="CIVIL">Civil Engineering (CIVIL)</option>
                    </select>
                  ) : (
                    <select
                      className="form-select bg-white text-dark border border-secondary shadow-sm"
                      id="club"
                      value={club}
                      onChange={(e) => setClub(e.target.value)}
                    >
                      <option value="">Select a club</option>
                      <option value="ISTE">Indian Society for Technical Education (ISTE)</option>
                      <option value="CSI">Computer Society of India (CSI)</option>
                      <option value="IEEE">Institute of Electrical and Electronics Engineers (IEEE)</option>
                      <option value="NSS">National Service Scheme (NSS)</option>
                      <option value="VJSV">Vignana Jyothi Sahithi Vanam (VJSV)</option>
                      <option value="AOL">Art of Living (AOL)</option>
                    </select>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="imageUrl" className="form-label">
                    Image URL <span className="text-muted">(Optional)</span>
                  </label>
                  <input
                    type="url"
                    className="form-control bg-white text-dark border border-secondary shadow-sm"
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
                  <div className="form-text">Add an image URL to make your blog more engaging</div>
                </div>

                <div className="mb-4">
                  <label htmlFor="content" className="form-label">Content</label>
                  <textarea
                    className="form-control bg-white text-dark border border-secondary shadow-sm"
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows="10"
                    placeholder="Write your blog content here..."
                    required
                  ></textarea>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : (
                      'Update Blog'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;