import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState(""); // Updated field name
  const [imageUrl, setImageUrl] = useState("");
  const [language, setLanguage] = useState(""); // Language field
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!title || !author || !price || !desc || !imageUrl || !language) {
      setError("All fields are required!");
      setSuccessMessage(""); // Clear success message
      return;
    }

    // Ensure price is a valid number
    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid price.");
      setSuccessMessage(""); // Clear success message
      return;
    }

    const newBook = {
      title,
      author,
      price: parseFloat(price), // Convert price to a number
      desc, // Updated field name to match backend
      url: imageUrl, // Image URL
      language, // Language
    };

    try {
      // Sending POST request to add a new book
      const response = await axios.post("https://novel-nest-g2ny.onrender.com/api/v1/add-book", newBook, {
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure the admin is authenticated
          id: localStorage.getItem("userId"), // Pass user ID in headers
        },
      });

      // Success response handling
      setSuccessMessage("Book added successfully!");
      setError(""); // Clear previous errors

      // Optionally, redirect to the admin page or book listing page after adding the book
      setTimeout(() => {
        navigate("/admin"); // Redirect to the admin panel or book listing page
      }, 1500);
    } catch (err) {
      console.error("Error adding book:", err);
      setError(err.response?.data?.message || "Failed to add book.");
      setSuccessMessage(""); // Clear success message on error
    }
  };

  return (
    <div className="bg-zinc-900 text-white min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Add New Book</h1>

      {/* Display error or success message */}
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}

      {/* Add Book Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-lg">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
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
              value={price}
              onChange={(e) => setPrice(e.target.value)}
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
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 bg-zinc-800 rounded-lg text-white"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="desc" className="block text-lg">Description</label>
          <textarea
            id="desc" // Updated ID
            value={desc} // Updated field name
            onChange={(e) => setDesc(e.target.value)} // Updated field handler
            className="w-full p-2 bg-zinc-800 rounded-lg text-white"
            required
          />
        </div>

        {/* Image URL */}
        <div>
          <label htmlFor="imageUrl" className="block text-lg">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2 bg-zinc-800 rounded-lg text-white"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Add Book
        </button>
      </form>
    </div>
  );
};

export default AddBook;
