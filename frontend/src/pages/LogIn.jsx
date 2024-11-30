import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authActions } from "../store/auth";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { username, password } = formData;

    if (!username || !password) {
      setError("Both username and password are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:1000/api/v1/sign-in", {
        username,
        password,
      });

      const { id, role, token } = response.data;

      dispatch(
        authActions.login({
          token,
          userId: id,
          role,
        })
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.id);
      localStorage.setItem("userRole", response.data.role);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-zinc-900">
      <div className="bg-zinc-800 p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-3xl text-zinc-300 font-semibold mb-6">Log In</h1>

        {error && (
          <p className="text-red-500 mb-4 text-sm border border-red-500 bg-red-100 rounded px-2 py-1">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-zinc-300 text-sm mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-zinc-700 text-zinc-300"
              placeholder="e.g., johndoe123"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-zinc-300 text-sm mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-zinc-700 text-zinc-300"
              placeholder="Enter a secure password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed"
            disabled={loading || !formData.username || !formData.password}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
