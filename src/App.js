import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Blog from "./components/Blog";
import Weather from "./components/Weather";
import ManageTasks from "./components/TODO/ManageTasks";
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
          <Route path="weather" element={<Weather />} />
          <Route
            path="todo"
            element={<ManageTasks />}
          />
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
