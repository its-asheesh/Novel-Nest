import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Profile/Sidebar";
import { Outlet } from "react-router-dom";

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUserInfo = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        setError("Authentication error. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:1000/api/v1/get-user-information",
        {
          headers: {
            id: userId,
            authorization: `Bearer ${token}`,
          },
        }
      );

      setUserInfo(response.data);
    } catch (err) {
      console.error("Fetch user information error:", err);
      setError(err.response?.data?.message || "Failed to fetch user information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className="bg-zinc-900 text-white min-h-screen flex flex-col lg:flex-row py-8">
      {/* Sidebar Section */}
      <div className="w-full lg:w-1/4 p-4">
        <Sidebar data={userInfo} loading={loading} error={error} />
      </div>

      {/* Main Content Section */}
      <div className="w-full lg:w-3/4 p-4 overflow-hidden flex-grow">
        {/* Render nested routes */}
        <Outlet />
      </div>
    </div>
  );
};

export default Profile;
