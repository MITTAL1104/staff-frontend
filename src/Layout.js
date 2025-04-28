import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./pages/userPages/UserHeader";
import MainHeader from "./pages/MainHeader";
import AdminHeader from "./pages/AdminHeader";
import { jwtDecode } from "jwt-decode";

const Layout = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;

  const hideHeaderRoutes = ["/user", "/userEmployee", "/userAllocation", "/unauthorized"];
  const mainHeaderRoute = ["/","/register-with-details"];

  const token = sessionStorage.getItem("token");
  const isAdmin = token ? jwtDecode(token).isAdmin : false;

  const showUserHeader =
    hideHeaderRoutes.some(route => path.startsWith(route)) ||
    (path === "/updatePassword" && !isAdmin);

  const showMainHeader = mainHeaderRoute.includes(path);

  const showAdminHeader =
    (!showUserHeader && !showMainHeader) || (path === "/updatePassword" && isAdmin);

  return (
    <>
      {showMainHeader && <MainHeader />}
      {showUserHeader && <Header />}
      {showAdminHeader && <AdminHeader />}
      {children}
    </>
  );
};

export default Layout;
