import React, { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import loginImage from "./Loginimg.jpg"; 
import { LoginContext } from "../contexts/loginContext"; 

const Login = () => {
  const API_URL = "http://localhost:3001";
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(LoginContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const emailPattern = /^[0-9]{2}071[A-Za-z][0-9A-Za-z]{2,}@vnrvjiet\.in$/;

    if (!emailPattern.test(email)) {
      setErrorMessage("Invalid college email format!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) throw new Error("Failed to connect to server.");
      const users = await response.json();
      const user = users.find((u) => u.email === email);

      if (!user) {
        setErrorMessage("Email not found. Please register.");
        setIsLoading(false);
        return;
      }

      if (user.password !== password) {
        setErrorMessage("Incorrect password.");
        setIsLoading(false);
        return;
      }

      const userInfo = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email
      };

      sessionStorage.setItem("currentUser", JSON.stringify(userInfo));
      setIsAuthenticated(true);
      console.log({setIsAuthenticated});
      navigate("/home");
      console.log("User logged in:", userInfo);
      alert("Login successful!");

    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Server error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Left Section */}
      <div className="image-section">
        <img src={loginImage} alt="Login" />
        <h2>Your Campus</h2>
        <h2>Your Voice</h2>
      </div>

      {/* Right Section - Form */}
      <div className="form-section">
        <h2>Log In</h2>
        <p>Don't have an account? <a href="/register">Sign up</a></p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="College Email (e.g., 23071A05T7@vnrvjiet.in)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errorMessage && <span className="text-danger">{errorMessage}</span>}

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="checkbox-container">
            <label className="remember-me">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember Me</span>
            </label>
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <button 
            type="submit" 
            className="create-btn"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="continue">Or continue with</p>
        <div className="social-login">
          <button className="social-btn google">
            <i className="fa-brands fa-google"></i>
            <span>Google</span>
          </button>
          <button className="social-btn apple">
            <i className="fa-brands fa-apple"></i>
            <span>Apple</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
