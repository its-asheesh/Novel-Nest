import React, { useState, useEffect } from "react";
import Loader from "../Loader/Loader";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { GrLanguage } from "react-icons/gr";
import { FaHeart, FaShoppingCart, FaEdit, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";

const ViewBooksDetails = () => {
    const { id } = useParams(); // Get book ID from URL parameters
    const navigate = useNavigate();
    const [Data, setData] = useState(null); // State to store book details
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true); // Loading state
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const role = useSelector((state) => state.auth.role);

    // Fetch Book Details
    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await axios.get(`https://novel-nest-g2ny.onrender.com/api/v1/get-book-by-id/${id}`);
                setData(response.data.data);
            } catch (err) {
                console.error("Failed to fetch book details:", err);
                setError("Failed to fetch book details.");
            } finally {
                setLoading(false);
            }
        };
        fetchBookDetails();
    }, [id]);

    // Add Book to Favourites
    const handleFavourite = async () => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
            alert("Authentication error. Please log in again.");
            return;
        }

        try {
            const response = await axios.put(
                "https://novel-nest-g2ny.onrender.com/api/v1/add-book-to-favourite",
                { bookId: id },
                {
                    headers: {
                        id: userId,
                        authorization: `Bearer ${token}`,
                    },
                }
            );
            alert(response.data.message);
        } catch (err) {
            console.error("Failed to add to favourites:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Failed to add to favourites.");
        }
    };

    // Add Book to Cart
    const handleCart = async () => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        if (!userId || !token) {
            alert("Authentication error. Please log in again.");
            return;
        }

        try {
            const response = await axios.put(
                "https://novel-nest-g2ny.onrender.com/api/v1/add-to-cart",
                { bookId: id },
                {
                    headers: {
                        id: userId,
                        authorization: `Bearer ${token}`,
                    },
                }
            );
            alert(response.data.message);
        } catch (err) {
            console.error("Failed to add to cart:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Failed to add to cart.");
        }
    };

    // Edit Book (Admin Only)
    const handleEdit = () => {
        navigate(`/admin/edit-book/${id}`);
    };

    // Delete Book (Admin Only)
    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        try {
            const response = await axios.delete("https://novel-nest-g2ny.onrender.com/api/v1/delete-book", {
                headers: {
                    id: userId,
                    authorization: `Bearer ${token}`,
                },
                data: { bookid: id },
            });
            alert(response.data.message);
            navigate("/all-books"); // Redirect to book listing page after deletion
        } catch (err) {
            console.error("Failed to delete book:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Failed to delete book.");
        }
    };

    if (loading) {
        return (
            <div className="h-screen bg-zinc-900 flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen bg-zinc-900 flex items-center justify-center text-white">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <>
            {Data && (
                <div className="bg-zinc-900 px-6 py-8">
                    <div className="max-w-4xl mx-auto bg-zinc-800 p-6 rounded-lg shadow-md">
                        {/* Book Cover */}
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/3">
                                <img
                                    src={Data.url}
                                    alt={Data.title}
                                    className="w-full rounded-lg shadow-md items-center"
                                />
                            </div>

                            {/* Book Details */}
                            <div className="md:w-2/3 text-white">
                                <h1 className="text-3xl font-bold mb-3">{Data.title}</h1>
                                <p className="text-lg text-zinc-400 mb-2">by <span className="text-zinc-300">{Data.author}</span></p>
                                <p className="mb-4">{Data.desc}</p>

                                <div className="space-y-2">
                                    <p className="flex items-center">
                                        <GrLanguage className="mr-2" />
                                        Language: <span className="ml-2 text-zinc-300">{Data.language}</span>
                                    </p>
                                    <p className="text-xl font-semibold">
                                        Price: ₹<span className="ml-2 text-zinc-300">{Data.price}</span>
                                    </p>
                                    {Data.category && (
                                        <p>
                                            Categories:{" "}
                                            <span className="text-zinc-300">{Data.category.join(", ")}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Buttons */}
                                {isLoggedIn && role === "user" && (
                                    <div className="mt-6 flex gap-4">
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600"
                                            onClick={handleFavourite}
                                        >
                                            <FaHeart className="inline mr-2" />
                                            Add to Favourites
                                        </button>
                                        <button
                                            className="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600"
                                            onClick={handleCart}
                                        >
                                            <FaShoppingCart className="inline mr-2" />
                                            Add to Cart
                                        </button>
                                    </div>
                                )}

                                {isLoggedIn && role === "admin" && (
                                    <div className="mt-6 flex gap-4">
                                        <button
                                            className="bg-yellow-500 text-white px-4 py-2 rounded shadow-md hover:bg-yellow-600"
                                            onClick={handleEdit}
                                        >
                                            <FaEdit className="inline mr-2" />
                                            Edit Book
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600"
                                            onClick={handleDelete}
                                        >
                                            <FaTrash className="inline mr-2" />
                                            Delete Book
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ViewBooksDetails;
