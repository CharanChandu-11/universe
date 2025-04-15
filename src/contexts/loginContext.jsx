import { createContext, useState, useEffect } from "react";
export const LoginContext = createContext();
export const LoginProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const user = sessionStorage.getItem("currentUser");
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);
  return (
    <LoginContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </LoginContext.Provider>
  );
};
