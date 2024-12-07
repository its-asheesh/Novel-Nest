import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGripLines } from "react-icons/fa6";
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '../../store/auth'; // Adjust path if needed

const Navbar = () => {
    const links = [
        {
            title: "Home",
            link: "/",
        },
        {
            title: "About Us",
            link: "/about-us",
        },
        {
            title: "All Books",
            link: "/all-books",
        },
        {
            title: "Cart",
            link: "/cart",
        },
        {
            title: "Profile",
            link: "/profile",
        },
        {
            title: "Admin Profile",
            link: "/profile",
        },
    ];

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const dispatch = useDispatch();
    const role = useSelector((state) => state.auth.role);
    // Remove "Cart" and "Profile" links if not logged in
    if (!isLoggedIn) {
        links.splice(3, 3);
    }

    if(isLoggedIn == true && role === "user")
        {
            links.splice(5,1);
        }

    if(isLoggedIn == true && role === "admin")
    {
        links.splice(4,1);
    }
    const [MobileNav, setMobileNav] = useState("hidden");

    const handleLogout = () => {
        // Dispatch logout action
        dispatch(authActions.logout());
        // Redirect to home or login page
        window.location.href = "/";
    };
//https://cdn-icons-png.flaticon.com/128/10433/10433049.png
    return (
        <>
            <nav className='relative flex bg-zinc-800 text-white px-8 py-4 items-center justify-between'>
                <div className='flex items-center'>
                <img 
                    className='h-12 me-4 rounded-full shadow-lg '
                    src="/Novel.png" 
                    alt="logo" 
                />

                    <Link to="/" className='text-2xl font-semibold'>Novel Nest</Link>
                </div>
                <div className='nav-links-novel-nest block md:flex items-center gap-4'>
                    <div className='hidden md:flex gap-4'>
                        {links.map((item, i) => (
                            <Link 
                                to={item.link}
                                className='hover:text-blue-500 transition-all duration-300'
                                key={i}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </div>
                    <div className='hidden md:flex gap-4'>
                        {!isLoggedIn ? (
                            <>
                                <Link to="/LogIn" className='px-2 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300'>Login</Link>
                                <Link to="/SignUp" className='px-2 py-1 bg-blue-500 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300'>SignUp</Link>
                            </>
                        ) : (
                            <button 
                                onClick={handleLogout} 
                                className='px-2 py-1 bg-red-500 border border-red-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300'
                            >
                                Logout
                            </button>
                        )}
                    </div>
                    <button className='block md:hidden text-white text-2xl hover:text-zinc-400' onClick={() => (MobileNav === "hidden" ? setMobileNav("block") : setMobileNav("hidden"))}>
                        <FaGripLines />
                    </button>
                </div>
            </nav>

            <div className={` ${MobileNav} bg-zinc-800 h-screen absolute top-0 left-0 w-full z-40 flex flex-col items-center justify-center`}>
                {links.map((item, i) => (
                    <Link 
                        to={item.link}
                        className={`${MobileNav} text-white text-4xl mb-4 font-semibold hover:text-blue-500 transition-all duration-300`}
                        key={i}
                        onClick={() => (MobileNav === "hidden" ? setMobileNav("block") : setMobileNav("hidden"))}
                    >
                        {item.title}
                    </Link> 
                ))}
                
                {!isLoggedIn ? (
                    <>
                        <Link to="/LogIn" className={`${MobileNav} px-8 py-2 mb-8 text-3xl border border-blue-500 rounded text-white hover:bg-white hover:text-zinc-800 transition-all duration-300`}>Login</Link>
                        <Link to="/SignUp" className={`${MobileNav} px-8 py-2 mb-8 text-3xl bg-blue-500 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300`}>SignUp</Link>
                    </>
                ) : (
                    <button 
                        onClick={handleLogout} 
                        className={`${MobileNav} px-8 py-2 mb-8 text-3xl bg-red-500 border border-red-500 rounded hover:bg-white hover:text-zinc-800 transition-all duration-300`}
                    >
                        Logout
                    </button>
                )}
            </div>
        </>
    );
};

export default Navbar;
