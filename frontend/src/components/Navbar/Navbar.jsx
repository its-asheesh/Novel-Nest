import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGripLines } from "react-icons/fa";
import { useSelector } from "react-redux";

const Navbar = () => {
  const links = [
    { title: "Home", link: "/" },
    { title: "About Us", link: "/about-us" },
    { title: "All Books", link: "/all-books" },
    { title: "Cart", link: "/cart" },
    { title: "Profile", link: "/profile" },
    { title: "Admin Profile", link: "/profile" },
  ];

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  const [MobileNav, setMobileNav] = useState("hidden");

  // Adjust links dynamically based on login state and role
  if (!isLoggedIn) {
    links.splice(3, 3);
  }

  if (isLoggedIn === true && role === "user") {
    links.splice(5, 1);
  }

  if (isLoggedIn === true && role === "admin") {
    links.splice(3, 2);
  }

  return (
    <>
      <nav className="relative flex bg-zinc-800 text-white px-8 py-4 items-center justify-between shadow-xl">
        <div className="flex items-center">
          <img
            className="h-12 me-4 rounded-full shadow-lg"
            src="/Novel.png"
            alt="logo"
          />
          <Link to="/" className="text-3xl font-bold tracking-wide">
            Novel Nest
          </Link>
        </div>
        <div className="nav-links-novel-nest block md:flex items-center gap-4">
          <div className="hidden md:flex gap-6">
            {links.map((item, i) => (
              <Link
                to={item.link}
                className="text-lg font-medium hover:text-teal-100 transition-all duration-300 transform hover:scale-105"
                key={i}
              >
                {item.title}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex gap-6">
            {!isLoggedIn && (
              <>
                <Link
                  to="/LogIn"
                  className="px-4 py-2 border border-teal-600 rounded-lg hover:bg-teal-600 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/SignUp"
                  className="px-4 py-2 bg-teal-600 border border-teal-600 rounded-lg hover:bg-teal-500 transition-all duration-300"
                >
                  SignUp
                </Link>
              </>
            )}
          </div>
          <button
            className="block md:hidden text-white text-3xl"
            onClick={() =>
              MobileNav === "hidden" ? setMobileNav("block") : setMobileNav("hidden")
            }
          >
            <FaGripLines />
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`${MobileNav} bg-zinc-800 h-screen absolute top-0 left-0 w-full z-40 flex flex-col items-center justify-center`}
      >
        {links.map((item, i) => (
          <Link
            to={item.link}
            className="text-white text-4xl mb-6 font-semibold hover:text-teal-100 transition-all duration-300"
            key={i}
            onClick={() => setMobileNav("hidden")}
          >
            {item.title}
          </Link>
        ))}
        {!isLoggedIn && (
          <>
            <Link
              to="/LogIn"
              className="px-8 py-2 mb-6 text-3xl border border-teal-600 rounded text-white hover:bg-teal-600 hover:text-white transition-all duration-300"
              onClick={() => setMobileNav("hidden")}
            >
              Login
            </Link>
            <Link
              to="/SignUp"
              className="px-8 py-2 mb-6 text-3xl bg-teal-600 border border-teal-600 rounded hover:bg-teal-500 transition-all duration-300"
              onClick={() => setMobileNav("hidden")}
            >
              SignUp
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
