import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Blog from "./components/Blog";
import MyBlogs from "./components/MyBlogs";
import CreateBlog from "./components/CreateBlog";
import EditBlog from "./components/EditBlog";
import BlogDetails from "./components/BlogDetails";
import AllBlogs from "./components/AllBlogs";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout 
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
            />
          }
        >
          <Route
            index
            element={<Login setIsAuthenticated={setIsAuthenticated} />}/>
          <Route path="register" element={<Register />} />
          <Route path="home" element={<Home />} />
          <Route path="blog" element={<Blog />} />
          <Route path="my-blogs" element={<MyBlogs />} />
          <Route path="/create-blog" element={<CreateBlog />} />
              <Route path="/edit-blog/:id" element={<EditBlog />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/all-blogs" element={<AllBlogs />} />
          <Route
            path="login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
        </Route>
      </Routes>
    </Router>
  );
}
export default App;