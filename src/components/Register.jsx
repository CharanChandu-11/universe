import React, { useState,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import { LoginContext } from "../contexts/loginContext"; 

const Register = () => {
  const navigate = useNavigate();
  const API_URL = "http://localhost:3001";
  const { setIsAuthenticated } = useContext(LoginContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    collegeName: "",
    course: "",
    year: "",
    bio: "",
    profilePic: null,
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({
    email: false,
    password: false,
    profilePic: false,
    username: false,
    termsAccepted: false,
    submission: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });

    if (name in errors) {
      setErrors({ ...errors, [name]: false, submission: "" });
    }
  };

  const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@vnrvjiet\.in$/.test(email);
  const validatePassword = (password) => password.length >= 8 && /\d/.test(password);
  const validateProfilePic = (file) =>
    !file || (["image/jpeg", "image/png"].includes(file.type) && file.size <= 2 * 1024 * 1024);

  const checkUserExists = async (username, email) => {
    try {
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) throw new Error("Failed to fetch users");

      const users = await response.json();

      return {
        usernameExists: users.some((user) => user.username === username),
        emailExists: users.some((user) => user.email === email),
      };
    } catch (err) {
      console.error("Error checking user existence:", err);
      throw new Error("Error connecting to the database. Make sure the JSON server is running.");
    }
  };

  const addUserToDatabase = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const users = await response.json();

      const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;

      const newUser = {
        id: newId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        collegeName: userData.collegeName,
        course: userData.course,
        year: userData.year,
        bio: userData.bio || "",
      };

      const postResponse = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!postResponse.ok) throw new Error("Failed to create user");

      return true;
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({ ...errors, submission: "" });

    try {
      const isEmailValid = validateEmail(formData.email);
      const isPasswordValid = validatePassword(formData.password);
      const isProfilePicValid = validateProfilePic(formData.profilePic);
      const isTermsAccepted = formData.termsAccepted;

      const formErrors = {
        email: !isEmailValid,
        password: !isPasswordValid,
        profilePic: !isProfilePicValid,
        username: false,
        termsAccepted: !isTermsAccepted,
        submission: "",
      };

      if (!isEmailValid || !isPasswordValid || !isProfilePicValid || !isTermsAccepted) {
        setErrors(formErrors);
        setIsSubmitting(false);
        return;
      }

      const { usernameExists, emailExists } = await checkUserExists(
        formData.username,
        formData.email
      );

      if (usernameExists) {
        formErrors.username = true;
        formErrors.submission = "Username already exists. Please choose another.";
        setErrors(formErrors);
      } else if (emailExists) {
        formErrors.email = true;
        formErrors.submission = "Email already registered. Please log in.";
        setErrors(formErrors);
      } else {
        await addUserToDatabase(formData);
        alert("Account created successfully!");
        setIsAuthenticated(true);
        navigate("/home");
      }
    } catch (error) {
      setErrors({ ...errors, submission: "Registration failed: " + error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="image-section">
        <img
          src="https://framerusercontent.com/images/6yev73ANQDGpsmyQ8qsRjLEnSsc.jpg?scale-down-to=2048"
          alt="Campus community illustration"
        />
        <h2>Your Campus<br />Your Voice</h2>
      </div>

      <div className="form-section">
        <h2>Register with an Account</h2>
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>

        {errors.submission && <div className="error-banner">{errors.submission}</div>}

        <form onSubmit={handleSubmit}>
          <div className="name-row">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && <span className="text-danger">Username already taken!</span>}

          <input
            type="email"
            name="email"
            placeholder="College Email (e.g., 23071A05T7@vnrvjiet.in)"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && (
            <span className="text-danger">Invalid college email or already registered!</span>
          )}

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && (
            <span className="text-danger">
              Password must be at least 8 characters with at least one number.
            </span>
          )}

          <input
            type="text"
            name="collegeName"
            placeholder="College Name"
            value={formData.collegeName}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="course"
            placeholder="Course/Major"
            value={formData.course}
            onChange={handleChange}
            required
          />

          <select name="year" value={formData.year} onChange={handleChange} required>
            <option value="" disabled>Year of Study</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>

          <textarea
            name="bio"
            placeholder="Short Bio (optional)"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
          ></textarea>

          <input
            type="file"
            name="profilePic"
            accept="image/*"
            onChange={handleChange}
          />
          {errors.profilePic && (
            <span className="text-danger">Only JPG/PNG images under 2MB are allowed.</span>
          )}

          <div className="form-check">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="form-check-input"
              required
            />
            <label className="form-check-label">I agree to the Terms & Conditions</label>
          </div>
          {errors.termsAccepted && (
            <span className="text-danger">Please accept the terms to continue.</span>
          )}

          <button type="submit" className="create-btn" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
