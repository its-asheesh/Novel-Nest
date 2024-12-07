import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Sidebar = ({ data, loading, error }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const role = useSelector((state) => state.auth.role);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="relative">
      {/* Mobile Menu Toggle Button */}
      <div className="lg:hidden bg-green-500 p-4 flex items-center justify-between">
        <p className="text-white text-lg font-bold">Menu</p>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white text-2xl">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`lg:block fixed lg:relative lg:h-auto bg-zinc-900 text-white shadow-xl p-6 lg:w-auto w-64 h-full transform transition-transform rounded-lg flex flex-col justify-between ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* User Info Section */}
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="text-center mb-6">
            <img
              src={data?.avatar || "/default-avatar.png"}
              alt="User Avatar"
              className="h-24 w-24 rounded-full mx-auto border-4 border-green-500"
            />
            <p className="mt-6 text-lg font-bold text-gray-800">{data?.username || "Username"}</p>
            <p className="text-sm text-gray-600">{data?.email || "email@example.com"}</p>
          </div>
        )}

        {/* Spacer to push the navigation to the bottom */}
        <div className="flex-grow"></div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-4 mb-6">
          <Link
            to="/profile"
            className="block text-center py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition transform hover:scale-105"
          >
            Profile
          </Link>
          <Link
            to="/profile/favourites"
            className="block text-center py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition transform hover:scale-105"
          >
            Favourites
          </Link>
          <Link
            to="/profile/orderHistory"
            className="block text-center py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition transform hover:scale-105"
          >
            Order History
          </Link>
          {role === "admin" && (
            <Link
              to="/admin"
              className="block text-center py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition transform hover:scale-105"
            >
              Admin Panel
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="block text-center py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
