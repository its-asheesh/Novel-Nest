import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For redirection

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const { username, email, password, confirmPassword, address } = formData;

        // Form validation
        if (!username || !email || !password || !confirmPassword || !address) {
            setError("All fields are required.");
            return;
        }
        if (username.length < 4) {
            setError("Username must be at least 4 characters long.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }
        if (address.trim().length === 0) {
            setError("Address cannot be empty.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:1000/api/v1/sign-up", {
                username,
                email,
                password,
                address,
            });
            console.log(response.data);
            setSuccess("Sign up successful! Redirecting to login page...");
            setFormData({
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
                address: "",
            });
            setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-zinc-900">
            <div className="bg-zinc-800 p-8 rounded shadow-lg w-full max-w-md">
                <h1 className="text-3xl text-zinc-300 font-semibold mb-6">Sign Up</h1>

                {error && (
                    <p className="text-red-500 mb-4 text-sm border border-red-500 bg-red-100 rounded px-2 py-1">
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-green-500 mb-4 text-sm border border-green-500 bg-green-100 rounded px-2 py-1">
                        {success}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Username */}
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-zinc-300 text-sm mb-2">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded bg-zinc-700 text-zinc-300"
                            placeholder="Enter your username"
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-zinc-300 text-sm mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded bg-zinc-700 text-zinc-300"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-zinc-300 text-sm mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded bg-zinc-700 text-zinc-300"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="block text-zinc-300 text-sm mb-2">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded bg-zinc-700 text-zinc-300"
                            placeholder="Re-enter your password"
                        />
                    </div>

                    {/* Address */}
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-zinc-300 text-sm mb-2">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            className="w-full p-2 rounded bg-zinc-700 text-zinc-300"
                            placeholder="Enter your address"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 rounded bg-green-500 hover:bg-green-600 text-white font-semibold"
                        disabled={loading}
                    >
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
