import { motion } from "framer-motion";
import Button from "../UI/Button";
import { useState } from "react";
import { signIn } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, setCredentials, loginFailure } from "../../store/slices/authSlice";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const initailData = {
    email: "",
    password: "",
  };
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initailData);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const mutation = useMutation({
    mutationFn: (data) => signIn(data),
    onMutate: () => {
      dispatch(loginStart());
    },
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      navigate("/");
    },
    onError: (error) => {
      dispatch(loginFailure(error.message || "Sign In failed"));
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    mutation.mutate(formData);
    setFormData(initailData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg shadow-2xl rounded-2xl border border-white/20"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Welcome Back 👋
        </h2>

        {/* Show error if any */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 text-sm mb-4 text-center"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Email Field */}
          <div className="relative w-full">
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="peer block w-full rounded-lg bg-white/20 p-3 pt-5 text-white placeholder-transparent border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <label
              htmlFor="email"
              className="absolute left-3 top-3 text-gray-400 text-base transition-all 
               peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
               peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-200"
            >
              Email Address
            </label>
          </div>


          {/* Password Field */}
          <div className="relative w-full">
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="peer block w-full rounded-lg bg-white/20 p-3 pt-5 text-white placeholder-transparent border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <label
              htmlFor="password"
              className="absolute left-3 top-3 text-gray-400 text-base transition-all 
               peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
               peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-200"
            >
              Password
            </label>
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-200 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>


          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-lg shadow-md hover:opacity-90 transition"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <p className="text-sm text-center text-gray-200 mt-4">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-blue-200 font-medium hover:underline"
            >
              Sign Up
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
}