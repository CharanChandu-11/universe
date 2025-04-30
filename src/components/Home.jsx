import React from "react";
import { Link } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import "./Home.css";

const Home = () => {
  return (
    <div className="home">
    <section className="hero-with-spline">
        <div className="hero-text">
          <h1>Welcome to UniVerse</h1>
          <p>Stay updated with the latest academic insights, projects, and study materials.</p>
          <Link to="/blog" className="btn">Explore Blogs</Link>
        </div>
        <div className="hero-spline">
          <Spline scene="https://prod.spline.design/4MqUK4Kn04dAvl1I/scene.splinecode" />
        </div>
      </section>


      {/* Categories Section */}
      <section className="categories">
        <h2 className="text-white">Browse by Branch</h2>
        <div className="category-list">
          <Link to="/category/cse">Computer Science (CSE)</Link>
          <Link to="/category/ece">Electronics & Communication (ECE)</Link>
          <Link to="/category/me">Mechanical Engineering (ME)</Link>
          <Link to="/category/ee">Electrical Engineering (EE)</Link>
          <Link to="/category/civil">Civil Engineering</Link>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="featured text-white">
        <h2>Featured Posts</h2>
        <div className="blog-grid">
          <div className="blog-card">
            <h3>Introduction to Machine Learning</h3>
            <p>A beginner’s guide to ML concepts and algorithms.</p>
            <Link to="/blogs/1">Read More</Link>
          </div>
          <div className="blog-card">
            <h3>Best IoT Projects for ECE Students</h3>
            <p>Top IoT projects to work on as an ECE student.</p>
            <Link to="/blogs/2">Read More</Link>
          </div>
          <div className="blog-card">
            <h3>Structural Analysis in Civil Engineering</h3>
            <p>Understanding the fundamentals of structural design.</p>
            <Link to="/blogs/3">Read More</Link>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="text-white latest">
        <h2>Latest Posts</h2>
        <div className="blog-grid">
          <div className="blog-card">
            <h3>Top Programming Languages for CSE</h3>
            <p>Which languages are in demand for software engineers?</p>
            <Link to="/blogs/4">Read More</Link>
          </div>
          <div className="blog-card">
            <h3>Best CAD Software for Mechanical Engineers</h3>
            <p>Comparison of the best CAD tools for ME students.</p>
            <Link to="/blogs/5">Read More</Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>About UniVerse</h2>
        <p>
          Universe is a platform where students can explore academic topics, events
          and stay updated with the latest in technology and engineering.
        </p>
      </section>
    </div>
  );
};

export default Home;
