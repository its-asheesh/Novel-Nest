import React, { useState, useEffect } from "react";
import axios from "axios";

const Settings = () => {
  const [address, setAddress] = useState(""); // User's address
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchUserInfo = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      const response = await axios.get("https://novel-nest-g2ny.onrender.com/api/v1/get-user-information", {
        headers: {
          id: userId,
          authorization: `Bearer ${token}`,
        },
      });

      setAddress(response.data.address || ""); // Set current address
    } catch (err) {
      console.error("Failed to fetch user information:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to fetch user information.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!address.trim()) {
      setError("Address cannot be empty.");
      return;
    }

    try {
      const response = await axios.put(
        "https://novel-nest-g2ny.onrender.com/api/v1/update-address",
        { address },
        {
          headers: {
            id: userId,
            authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage(response.data.message);
      setError("");
    } catch (err) {
      console.error("Failed to update address:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to update address.");
      setSuccessMessage("");
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-white">
        <p>Loading your settings...</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 text-white p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

      <div className="space-y-4">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-400">
            Address
          </label>
          <textarea
            id="address"
            rows="4"
            className="w-full p-3 border border-gray-700 rounded-lg bg-zinc-800 text-white"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button
          onClick={handleUpdateAddress}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Update Address
        </button>
      </div>
    </div>
  );
};

export default Settings;
