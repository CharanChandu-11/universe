import React, {useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { LoginContext } from "../contexts/loginContext"; 
const Header = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(LoginContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/home">UniVerse</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto"> 
        <li className="nav-item">
            <Link className="nav-link" to="/blog">Blogs</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <button className="nav-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          )}
          
        </ul>
      </div>
    </nav>
  );
};

export default Header;
