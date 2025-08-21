import { useState } from "react";
import Button from "../UI/Button";
import { signUp } from "../../api";
import { motion } from "framer-motion";

export default function SignUp() {
  const initialState = {
    name: "",
    email: "",
    password: "",
  };
  const [formData, setFormData] = useState(initialState);
  const [message, setMessage] = useState(""); // success/error messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signUp(formData);
      setMessage("Account created successfully! 🎉 Redirecting to Sign In...");
      setFormData(initialState);
      setTimeout(() => {
        window.location.href = "/signin";
      }, 1500);
    } catch (err) {
      setMessage("Something went wrong, please try again ❌");
    }
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
          Create Account ✨
        </h2>

        {/* Success/Error Message */}
        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-4 text-sm text-white font-medium"
          >
            {message}
          </motion.p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Name Field */}
          <div className="relative w-full">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="peer block w-full rounded-lg bg-white/20 p-3 pt-5 text-white placeholder-transparent border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <label
              className="absolute left-3 top-3 text-gray-400 text-base transition-all 
               peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
               peer-focus:top-1 peer-focus:text-xs peer-focus:text-green-200"
            >
              Full Name
            </label>
          </div>


          {/* Email Field */}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="peer block w-full rounded-md bg-white/20 px-3 pt-5 pb-2 text-white placeholder-transparent border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <label
              className={`absolute left-3 text-gray-200 transition-all 
              ${formData.email ? "top-1 text-xs text-blue-200" : "top-5 text-gray-400 text-sm"} 
              peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-200`}
            >
              Email Address
            </label>
          </div>


          {/* Password Field */}
          <div className="relative w-full">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="peer block w-full rounded-lg bg-white/20 p-3 pt-5 text-white placeholder-transparent border border-white/30 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <label
              className="absolute left-3 top-3 text-gray-400 text-base transition-all 
               peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
               peer-focus:top-1 peer-focus:text-xs peer-focus:text-green-200"
            >
              Password
            </label>
          </div>


          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 to-teal-500 text-white font-semibold py-3 rounded-lg shadow-md hover:opacity-90 transition"
          >
            Sign Up
          </Button>
        </form>

        <p className="text-sm text-center text-gray-200 mt-6">
          Already have an account?{" "}
          <a
            href="/signin"
            className="text-green-200 font-medium hover:underline"
          >
            Sign In
          </a>
        </p>
      </motion.div>
    </div>
  );
}