import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaTrash } from "react-icons/fa";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderMessage, setOrderMessage] = useState("");

  // Fetch Cart Items
  const fetchCart = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:1000/api/v1/get-user-cart", {
        headers: {
          id: userId,
          authorization: `Bearer ${token}`,
        },
      });
      setCartItems(response.data.data);
    } catch (err) {
      console.error("Failed to fetch cart items:", err.response?.data || err.message);
      setError(err.response?.data?.message || "An error occurred while fetching the cart.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Place Order
  const handlePlaceOrder = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:1000/api/v1/place-order",
        { order: cartItems },
        {
          headers: {
            id: userId,
            authorization: `Bearer ${token}`,
          },
        }
      );
      setOrderMessage(response.data.message);
      setCartItems([]); // Clear the cart locally after placing the order
    } catch (err) {
      console.error("Failed to place order:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to place order.");
    }
  };

  // Handle Remove from Cart
  const handleRemoveFromCart = async (bookId) => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:1000/api/v1/remove-from-cart/${bookId}`, {
        headers: {
          id: userId,
          authorization: `Bearer ${token}`,
        },
      });

      // Remove the item locally
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== bookId));
    } catch (err) {
      console.error("Failed to remove item from cart:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to remove item from cart.");
    }
  };

  // Calculate Total Amount
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <p className="text-center text-white">Loading your cart...</p>;

  return (
    <div className="bg-zinc-900 text-white p-6 h-auto flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {orderMessage && <p className="text-green-500">{orderMessage}</p>}
      {cartItems.length > 0 ? (
        <div>
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li
                key={item._id}
                className="p-4 border border-zinc-700 rounded-lg bg-zinc-800 flex items-center space-x-4"
              >
                {/* Book Image */}
                <img
                  src={item.url || "/default-book-cover.jpg"} // Fallback for missing image
                  alt={item.title}
                  className="h-24 w-16 object-cover rounded-md"
                />

                {/* Book Details */}
                <div className="flex-grow">
                  <p className="text-lg font-semibold">{item.title}</p>
                  <p className="text-sm text-zinc-400">by {item.author}</p>
                  <p className="text-xl font-bold text-green-400">₹ {item.price}</p>
                </div>

                {/* Remove from Cart Button */}
                <button
                  onClick={() => handleRemoveFromCart(item._id)}
                  className="text-red-500 hover:text-red-600"
                  title="Remove from Cart"
                >
                  <FaTrash className="text-lg" />
                </button>
              </li>
            ))}
          </ul>

          {/* Total Amount */}
          <div className="mt-6 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
            <h2 className="text-xl font-semibold">Total Amount to Pay</h2>
            <p className="text-2xl font-bold text-green-400">₹ {calculateTotal()}</p>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            className="mt-6 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
          >
            Place Order
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow">
          <FaShoppingCart className="text-6xl text-gray-500 mb-4" />
          <p>Your cart is empty.</p>
          <Link to="/all-books" className="text-green-500 underline">
            Browse Books
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
