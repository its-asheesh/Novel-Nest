import React, { useState, useEffect } from "react";
import axios from "axios";
import BookCard from "../BookCard/BookCard";
import { FaHeartBroken } from "react-icons/fa"; // Import the broken heart icon

const Favourites = () => {
  const [favouriteBooks, setFavouriteBooks] = useState([]); // State for favorite books
  const [error, setError] = useState(""); // State for error messages
  const [loading, setLoading] = useState(true); // State for loading status

  const fetchFavouriteBooks = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        setError("Authentication error. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "https://novel-nest-g2ny.onrender.com/api/v1/get-favourite-books",
        {
          headers: {
            id: userId,
            authorization: `Bearer ${token}`,
          },
        }
      );

      setFavouriteBooks(response.data.data); // Update state with the favorite books
    } catch (err) {
      console.error("Failed to fetch favorite books:", err);
      setError(err.response?.data?.message || "Failed to fetch favorite books.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBook = async (bookId) => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    try {
      await axios.delete("https://novel-nest-g2ny.onrender.com/api/v1/remove-book-to-favourite", {
        headers: {
          id: userId,
          authorization: `Bearer ${token}`,
        },
        data: { bookId }, // Send bookId in the request body
      });

      // Refetch the updated list of favourite books
      fetchFavouriteBooks();
      alert("Book removed from favourites successfully.");
    } catch (err) {
      console.error("Failed to remove book from favourites:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to remove book from favourites.");
    }
  };

  useEffect(() => {
    fetchFavouriteBooks();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        <p>Loading your favourite books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 px-6 py-8 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Your Favourite Books</h1>
      {favouriteBooks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favouriteBooks.map((book) => (
            <BookCard
              key={book._id}
              data={book}
              isFavourite={true} // Pass isFavourite as true
              onRemove={handleRemoveBook} // Pass the remove handler
            />
          ))}
        </div>
      ) : (
        <div className="text-center flex flex-col items-center justify-center content-center flex-grow h-full">
          <FaHeartBroken className="text-6xl text-red-500 mb-4" />
          <p className="text-xl">You have no favourite books yet.</p>
        </div>
      )}
    </div>
  );
};

export default Favourites;
