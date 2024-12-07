import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { FaUser, FaRegHeart, FaHistory, FaCogs, FaPlus, FaBox } from "react-icons/fa";
import { authActions } from "../../store/auth"; // Adjust path if needed

const Sidebar = ({ data, loading, error }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const role = useSelector((state) => state.auth.role);

  const handleLogout = () => {
    // Dispatch Redux action for logout
    dispatch(authActions.logout());
    localStorage.removeItem("userId"); // Clearing localStorage manually
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Function to close the sidebar after a link is clicked
  const handleLinkClick = () => {
    setIsOpen(false); // Close the sidebar after clicking a link
  };

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen); // Toggle the sidebar open/close
  };

  return (
    <div className="relative">
      {/* Mobile Menu Toggle Button */}
      <div className="lg:hidden bg-zinc-800 p-4 flex items-center justify-between shadow-lg">
        <p className="text-white text-lg font-semibold">Menu</p>
        <button onClick={toggleSidebar} className="text-white text-2xl">
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`lg:block fixed lg:relative bg-zinc-800 text-white shadow-xl p-6 lg:w-64 w-full h-full transform transition-all duration-300 ease-in-out rounded ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } z-50`}  // Ensure z-index is higher than overlay
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
              className="h-24 w-24 rounded-full mx-auto border-4 border-teal-500 shadow-lg"
            />
            <p className="mt-4 text-lg font-semibold">{data?.username || "Username"}</p>
            <p className="text-sm text-gray-400">{data?.email || "email@example.com"}</p>
          </div>
        )}

        {/* Spacer to push the navigation to the bottom */}
        <div className="flex-grow"></div>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-4 mb-6">
          {role === "user" && (
            <>
              <Link
                to="/profile/favourites"
                className="flex items-center gap-4 py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300 transform hover:scale-105"
                onClick={handleLinkClick}
              >
                <FaRegHeart />
                Favourites
              </Link>
              <Link
                to="/profile/orderHistory"
                className="flex items-center gap-4 py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300 transform hover:scale-105"
                onClick={handleLinkClick}
              >
                <FaHistory />
                Order History
              </Link>
              <Link
                to="/profile/settings"
                className="flex items-center gap-4 py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300 transform hover:scale-105"
                onClick={handleLinkClick}
              >
                <FaCogs />
                Settings
              </Link>
            </>
          )}

          {role === "admin" && (
            <>
              <Link
                to="/admin/add-book"
                className="flex items-center gap-4 py-2 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 transform hover:scale-105"
                onClick={handleLinkClick}
              >
                <FaPlus />
                Add Book
              </Link>
              <Link
                to="/admin/allorders"
                className="flex items-center gap-4 py-2 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 transform hover:scale-105"
                onClick={handleLinkClick}
              >
                <FaBox />
                All Orders
              </Link>
            </>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 transform hover:scale-105"
          >
            <FaUser />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"  // Ensure overlay has a lower z-index than sidebar
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
