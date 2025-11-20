import React, { useState } from "react";
import Button from "../UI/Button";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../../api";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendMutation = useMutation({
    mutationFn: () => forgotPassword(email),
    onSuccess: () => {
      setEmail("");
      navigate("/signin")
    },
    onError: (error) => {
      console.error("Error in forgot password: ", error);
      setEmail("");
    },
  });

  const handleClick = () => {
    sendMutation.mutate();
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-2">
          Forgot Password
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your registered email address and we’ll send you a reset link.
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              placeholder="Enter your email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <Button
            onClick={handleClick}
            className="w-full py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition cursor-pointer"
          >
            {sendMutation.isPending ? "Sending..." : "Send Reset Link"}
          </Button>

          {sendMutation.isSuccess && (
            <p className="text-sm text-green-600 text-center">
              Reset link sent successfully!
            </p>
          )}
          {sendMutation.isError && (
            <p className="text-sm text-red-600 text-center">
              Failed to send reset link. Try again.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;