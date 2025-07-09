import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import AuthFormCard from "./AuthFormCard";
import { signin, loadUser, clearError } from "../store/authSlice";
import { toast } from "react-toastify";

const AuthTabs = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSignin = async (e) => {
    e.preventDefault();
    const email = e.target.elements[0].value.trim();
    const password = e.target.elements[1].value;

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    try {
      const result = await dispatch(signin({ email, password }));

      if (signin.fulfilled.match(result)) {
        const user = result.payload?.user;

        if (user?.admin || user?.role === "admin") {
          await dispatch(loadUser());
        } else {
          toast.error("Access denied: Admins only");
        }
      } else {
        toast.error(result.payload || "Signin failed");
      }
    } catch (err) {
      toast.error("Signin failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md">
        <AuthFormCard handleSignin={onSignin} />
      </div>
    </div>
  );
};

export default AuthTabs;
