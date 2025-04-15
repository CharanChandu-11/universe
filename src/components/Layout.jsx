import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "./Layout.css"; // Add this CSS file

const Layout = ({ isAuthenticated, setIsAuthenticated }) => {
  return (
    <div className="layout">
      <Header  isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated} />
      <main className="content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
