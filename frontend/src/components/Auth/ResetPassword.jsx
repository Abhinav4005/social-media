import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Button from "../UI/Button";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../../api";
import { Eye, EyeOff } from "lucide-react"

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const initialState = {
        newPassword: "",
        confirmPassword: "",
    };

    const [formData, setFormData] = useState(initialState);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const submitMutation = useMutation({
        mutationFn: () =>
            resetPassword(token, formData.newPassword, formData.confirmPassword),
        onSuccess: () => {
            setFormData(initialState);
            navigate("/signin");
        },
        onError: (error) => {
            console.error("Failed to reset password: ", error);
            setFormData(initialState);
            navigate("/forgot-password");
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        submitMutation.mutate();
    };

    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl px-8 py-10">
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    Reset Your Password
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                >
                    <div className="relative">
                        <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-gray-600 mb-1"
                        >
                            New Password
                        </label>
                        <input
                            type={showNew ? "text" : "password"}
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            placeholder="Enter new password"
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Button
                            type="button"
                            variant="icon"
                            color="gray"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute right-3 top-7 cursor-pointer"
                        >
                            {showNew ? <Eye size={20}/> : <EyeOff size={20}/>}
                        </Button>
                    </div>

                    <div className="relative">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-600 mb-1"
                        >
                            Confirm Password
                        </label>
                        <input
                            type={showConfirm ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            placeholder="Re-enter password"
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <Button
                            type="button"
                            variant="icon"
                            color="gray"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-7 cursor-pointer"
                        >
                            {showConfirm ? <Eye size={20} /> : <EyeOff size={20} />}
                        </Button>
                    </div>

                    <Button
                        type="submit"
                        disabled={submitMutation.isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition duration-200"
                    >
                        {submitMutation.isPending ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>

                <p className="text-sm text-gray-500 text-center mt-6">
                    Remembered your password?{" "}
                    <span
                        onClick={() => navigate("/signin")}
                        className="text-indigo-600 hover:underline cursor-pointer"
                    >
                        Sign in
                    </span>
                </p>
            </div>
        </div>
    );
};

export default ResetPassword;