import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart } from "react-icons/fa";

const BookCard = ({ data, onRemove, isFavourite, isInCart }) => {
  const handleRemoveClick = () => {
    if (onRemove) {
      onRemove(data._id); // Trigger the remove function passed as a prop
    }
  };

  return (
    <div className="bg-zinc-800 rounded-lg p-4 flex flex-col ">
      <Link to={`/view-book-details/${data._id}`}>
        <div className="bg-zinc-900 rounded-lg flex items-center justify-center overflow-hidden">
          <img src={data.url} alt={data.title} className="h-[25vh] " />
        </div>
        <h2 className="mt-4 text-xl text-white font-semibold">{data.title}</h2>
        <p className="mt-2 text-zinc-400 font-medium">by {data.author}</p>
        <p className="mt-2 text-xl text-zinc-200 font-semibold">₹ {data.price}</p>
      </Link>

      {/* Conditional Buttons */}
      {isFavourite && (
        <button
          className="bg-red-500 px-4 py-2 rounded-lg text-white mt-4 hover:bg-red-600 transition"
          onClick={handleRemoveClick}
        >
          <FaHeart className="inline-block mr-2" />
          Remove from Favourites
        </button>
      )}

      {isInCart && (
        <button
          className="bg-red-500 px-4 py-2 rounded-lg text-white mt-4 hover:bg-red-600 transition"
          onClick={handleRemoveClick}
        >
          <FaShoppingCart className="inline-block mr-2" />
          Remove from Cart
        </button>
      )}
    </div>
  );
};

export default BookCard;
