import { Outlet } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import { Toaster } from "react-hot-toast";

const Layout = () => {
  return (
    <>
      <Sidebar />
      <Outlet />
    </>
  );
};

export default Layout;
