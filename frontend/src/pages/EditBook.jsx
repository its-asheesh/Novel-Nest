import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSave } from "react-icons/fa";
import { useSelector } from "react-redux";

const EditBook = () => {
    const { id } = useParams(); // Get book ID from URL parameters
    const navigate = useNavigate();
    const [bookDetails, setBookDetails] = useState({
        title: "",
        author: "",
        price: "",
        desc: "",
        url: "",
        language: "",
    });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const role = useSelector((state) => state.auth.role);

    // Fetch Book Details on Page Load
    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await axios.get(`https://novel-nest-g2ny.onrender.com/api/v1/get-book-by-id/${id}`);
                setBookDetails(response.data.data); // Set book details in state
            } catch (err) {
                console.error("Failed to fetch book details:", err);
                setError("Failed to fetch book details.");
            }
        };
        fetchBookDetails();
    }, [id]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookDetails((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle book update
    const handleUpdate = async (e) => {
        e.preventDefault();

        const { title, author, price, desc, url, language } = bookDetails;

        // Form validation
        if (!title || !author || !price || !desc || !url || !language) {
            setError("All fields are required!");
            setSuccessMessage(""); // Clear success message
            return;
        }

        // Send PUT request to update the book
        try {
            const response = await axios.put(
                "https://novel-nest-g2ny.onrender.com/api/v1/update-book",
                { bookid: id, title, author, price, desc, url, language },
                {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem("token")}`,
                        id: localStorage.getItem("userId"),
                    },
                }
            );

            setSuccessMessage("Book updated successfully!");
            setError(""); // Clear previous errors
            setTimeout(() => {
                navigate("/admin"); // Redirect to admin panel after success
            }, 1500);
        } catch (err) {
            console.error("Error updating book:", err);
            setError(err.response?.data?.message || "Failed to update book.");
            setSuccessMessage(""); // Clear success message on error
        }
    };

    if (!isLoggedIn || role !== "admin") {
        navigate("/login"); // Redirect if the user is not logged in or not an admin
    }

    return (
        <div className="bg-zinc-900 text-white min-h-screen p-6">
            <h1 className="text-3xl font-bold mb-4">Edit Book</h1>

            {/* Error or Success Messages */}
            {error && <p className="text-red-500">{error}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}

            <form onSubmit={handleUpdate} className="space-y-4">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-lg">Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={bookDetails.title}
                        onChange={handleChange}
                        className="w-full p-2 bg-zinc-800 rounded-lg text-white"
                        required
                    />
                </div>

                {/* Author */}
                <div>
                    <label htmlFor="author" className="block text-lg">Author</label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        value={bookDetails.author}
                        onChange={handleChange}
                        className="w-full p-2 bg-zinc-800 rounded-lg text-white"
                        required
                    />
                </div>

                {/* Price and Language in one row */}
                <div className="flex space-x-4">
                    {/* Price */}
                    <div className="w-full">
                        <label htmlFor="price" className="block text-lg">Price (₹)</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={bookDetails.price}
                            onChange={handleChange}
                            className="w-full p-2 bg-zinc-800 rounded-lg text-white"
                            required
                        />
                    </div>

                    {/* Language */}
                    <div className="w-full">
                        <label htmlFor="language" className="block text-lg">Language</label>
                        <input
                            type="text"
                            id="language"
                            name="language"
                            value={bookDetails.language}
                            onChange={handleChange}
                            className="w-full p-2 bg-zinc-800 rounded-lg text-white"
                            required
                        />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="desc" className="block text-lg">Description</label>
                    <textarea
                        id="desc"
                        name="desc"
                        value={bookDetails.desc}
                        onChange={handleChange}
                        className="w-full p-2 bg-zinc-800 rounded-lg text-white"
                        required
                    />
                </div>

                {/* Image URL */}
                <div>
                    <label htmlFor="url" className="block text-lg">Image URL</label>
                    <input
                        type="text"
                        id="url"
                        name="url"
                        value={bookDetails.url}
                        onChange={handleChange}
                        className="w-full p-2 bg-zinc-800 rounded-lg text-white"
                        required
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                    <FaSave className="inline mr-2" />
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditBook;
