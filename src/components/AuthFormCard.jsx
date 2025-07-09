import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setAuthStatusIdle } from "../store/authSlice";

const AuthFormCard = ({ handleSignin }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoggedIn, user, status, error, currentAction } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isLoggedIn && user) {
      if (user?.admin || user?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        toast.error("Access denied. Admins only.");
      }
    }
  }, [isLoggedIn, user, navigate]);


  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleInputChange = () => {
    if (status !== "idle") {
      dispatch(setAuthStatusIdle());
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl w-full max-w-md p-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-primary font-opensans">Admin Login</h2>
        <p className="text-sm text-gray-500 font-nunito mt-1">
          Enter your admin credentials to access the dashboard.
        </p>
      </div>

      <form className="space-y-4 animate-fade-in" onSubmit={handleSignin}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-md focus:outline-none"
          required
          onChange={handleInputChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-md focus:outline-none"
          required
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-md font-semibold hover:bg-[#0d2f6c] transition"
          disabled={status === "loading"}
        >
          {status === "loading" && currentAction === "signin"
            ? "Signing in..."
            : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default AuthFormCard;
