import React, { useEffect, useState } from "react";
import axios from "axios";

const UserOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUserOrderHistory = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:1000/api/v1/get-order-history", {
        headers: {
          id: userId,
          authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data.data);
    } catch (err) {
      console.error("Failed to fetch order history:", err.response?.data || err.message);
      setError(err.response?.data?.message || "An error occurred while fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserOrderHistory();
  }, []);

  if (loading) return <p className="text-center text-white">Loading your orders...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="bg-zinc-900 text-white min-h-screen p-6 pb-20">
      <h1 className="text-2xl font-bold mb-4">Your Order History</h1>
      <div className="overflow-auto max-h-screen">
        {orders.length > 0 ? (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li key={order._id} className="p-4 border border-zinc-700 rounded-lg bg-zinc-800">
                <p>
                  <strong>Book:</strong> {order.book.title}
                </p>
                <p>
                  <strong>Price:</strong> ₹ {order.book.price}
                </p>
                <p>
                  <strong>Status:</strong> {order.status || "Pending"}
                </p>
                <p>
                  <strong>Ordered At:</strong> {new Date(order.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default UserOrderHistory;
