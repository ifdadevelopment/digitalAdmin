import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import AuthTabs from "./components/AuthTabs";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import AdminLayout from "./components/AdminLayout";

const App = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Navigate to={isLoggedIn ? "/admin/dashboard" : "/auth"} replace />} />
        <Route
          path="/auth"
          element={!isLoggedIn ? <AuthTabs /> : <Navigate to="/" />}
        />
           <Route path="/profile" element={<AdminDashboard />} />
        {isLoggedIn && (
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Home />} />
          </Route>
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <ToastContainer />
    </>
  );
};

export default App;
