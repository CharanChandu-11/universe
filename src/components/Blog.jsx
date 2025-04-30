import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../contexts/loginContext";
import "./Blog.css"; 
const Blog = () => {
  const API_URL = "http://localhost:3001";
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedClub, setSelectedClub] = useState("");
  const [filterType, setFilterType] = useState("department"); // "department" or "club"
  
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(LoginContext);

  // Get the current user from session storage
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser")) || {};

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
        setFilteredBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [API_URL]);

  useEffect(() => {
    // Filter blogs based on search term, selected department and club
    const filtered = blogs.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            blog.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesFilter = true;
      
      if (filterType === "department" && selectedDepartment !== "") {
        matchesFilter = blog.department === selectedDepartment;
      } else if (filterType === "club" && selectedClub !== "") {
        matchesFilter = blog.club === selectedClub;
      }
      
      return matchesSearch && matchesFilter;
    });
    
    setFilteredBlogs(filtered);
  }, [searchTerm, selectedDepartment, selectedClub, filterType, blogs]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
    setFilterType("department");
    setSelectedClub("");
  };

  const handleClubChange = (club) => {
    setSelectedClub(club);
    setFilterType("club");
    setSelectedDepartment("");
  };

  const handleFilterTypeChange = (type) => {
    setFilterType(type);
    if (type === "department") {
      setSelectedClub("");
    } else {
      setSelectedDepartment("");
    }
  };

  const handleCreateBlog = () => {
    navigate('/create-blog');
  };

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
    <div className="m-3 blog-container mt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-md-8 blog-header">
          <h1 className="display-4 abc">UniVerse Blogs</h1>
          <p className="lead text-muted">Discover insights, projects, and knowledge from your peers</p>
        </div>
        <div className="col-md-4 d-flex justify-content-end blog-actions align-items-center">
          {currentUser.id && (
            <div className="d-flex gap-2">
              <Link to="/my-blogs" className="btn text-white btn-outline-primary">My Blogs</Link>
              <button onClick={handleCreateBlog} className="btn btn-primary">Create New Blog</button>
            </div>
          )}
        </div>
        <div className="col-md-6 mb-3 mb-md-0">
          <div className="input-group">
            <input
              type="text"
              className="form-control blog-search-input bg-light border-1 border"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="col-md-6 filter-card">
          <div className="card">
            <div className="card-body  p-3">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title h6 mb-0">Filter By</h5>
                <div className="btn-group filter-type-btns" role="group" aria-label="Filter type">
                  <button 
                    type="button" 
                    className={`btn btn-sm text-white ${filterType === 'department' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleFilterTypeChange('department')}
                  >
                    Department
                  </button>
                  <button 
                    type="button" 
                    className={`btn btn-sm text-white ${filterType === 'club' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleFilterTypeChange('club')}
                  >
                    Club
                  </button>
                </div>
              </div>

              {filterType === 'department' ? (
                <div className="d-flex flex-wrap gap-2">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="department"
                      id="all-dept"
                      checked={selectedDepartment === ""}
                      onChange={() => handleDepartmentChange("")}
                    />
                    <label className="form-check-label" htmlFor="all-dept">All</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="department"
                      id="CSE"
                      checked={selectedDepartment === "CSE"}
                      onChange={() => handleDepartmentChange("CSE")}
                    />
                    <label className="form-check-label" htmlFor="CSE">CSE</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="department"
                      id="IT"
                      checked={selectedDepartment === "IT"}
                      onChange={() => handleDepartmentChange("IT")}
                    />
                    <label className="form-check-label" htmlFor="IT">IT</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="department"
                      id="MECH"
                      checked={selectedDepartment === "MECH"}
                      onChange={() => handleDepartmentChange("MECH")}
                    />
                    <label className="form-check-label" htmlFor="MECH">MECH</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="department"
                      id="ECE"
                      checked={selectedDepartment === "ECE"}
                      onChange={() => handleDepartmentChange("ECE")}
                    />
                    <label className="form-check-label" htmlFor="ECE">ECE</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="department"
                      id="CIVIL"
                      checked={selectedDepartment === "CIVIL"}
                      onChange={() => handleDepartmentChange("CIVIL")}
                    />
                    <label className="form-check-label" htmlFor="CIVIL">CIVIL</label>
                  </div>
                </div>
              ) : (
                <div className="d-flex flex-wrap gap-2">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="club"
                      id="all-club"
                      checked={selectedClub === ""}
                      onChange={() => handleClubChange("")}
                    />
                    <label className="form-check-label" htmlFor="all-club">All</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="club"
                      id="ISTE"
                      checked={selectedClub === "ISTE"}
                      onChange={() => handleClubChange("ISTE")}
                    />
                    <label className="form-check-label" htmlFor="ISTE">ISTE</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="club"
                      id="CSI"
                      checked={selectedClub === "CSI"}
                      onChange={() => handleClubChange("CSI")}
                    />
                    <label className="form-check-label" htmlFor="CSI">CSI</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="club"
                      id="IEEE"
                      checked={selectedClub === "IEEE"}
                      onChange={() => handleClubChange("IEEE")}
                    />
                    <label className="form-check-label" htmlFor="IEEE">IEEE</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="club"
                      id="NSS"
                      checked={selectedClub === "NSS"}
                      onChange={() => handleClubChange("NSS")}
                    />
                    <label className="form-check-label" htmlFor="NSS">NSS</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="club"
                      id="VJSV"
                      checked={selectedClub === "VJSV"}
                      onChange={() => handleClubChange("VJSV")}
                    />
                    <label className="form-check-label" htmlFor="VJSV">VJSV</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="club"
                      id="AOL"
                      checked={selectedClub === "AOL"}
                      onChange={() => handleClubChange("AOL")}
                    />
                    <label className="form-check-label" htmlFor="AOL">AOL</label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Blogs */}
      <div className="row">
        {filteredBlogs.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info" role="alert">
              No blogs found matching your criteria.
            </div>
          </div>
        ) : (
          filteredBlogs.map(blog => (
            <div className="col-md-6 col-lg-4 mb-4" key={blog.id}>
              <div className="card h-100 shadow-sm ">
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
                    {blog.department && <span className="badge bg-primary me-1">{blog.department}</span>}
                    {blog.club && <span className="badge bg-success">{blog.club}</span>}
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

export default Blog;