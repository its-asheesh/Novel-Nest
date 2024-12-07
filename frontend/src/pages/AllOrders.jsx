import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch orders for admin
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:1000/api/v1/get-all-orders", {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data.data);  // Set the fetched orders to state
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  // Handle editing an order (navigate to the edit page)
  const handleUserData = (orderId) => {
    navigate(`/admin/edit-order/${orderId}`);
  };
  

  // Handle deleting an order
  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await axios.delete("http://localhost:1000/api/v1/delete-order", {
        headers: {
          authorization: `Bearer ${token}`,
        },
        data: { orderId },  // Sending the order ID to be deleted
      });
      alert(response.data.message);
      // Refresh orders list after deletion
      setOrders(orders.filter((order) => order._id !== orderId)); // Remove the deleted order from the list
    } catch (err) {
      console.error("Failed to delete order:", err);
      alert("Failed to delete order.");
    }
  };

  // Handle updating the status of the order
  const handleUpdateStatus = async (orderId, status) => {
    try {
      const response = await axios.put(
        `http://localhost:1000/api/v1/update-status/${orderId}`,
        { status },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.message);

      // Update the status of the specific order
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: response.data.status } : order
        )
      );
    } catch (err) {
      console.error("Failed to update order status:", err);
      alert("Failed to update order status.");
    }
  };

  if (loading) {
    return <div className="text-white text-center">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="bg-zinc-900 p-6">
      <h1 className="text-3xl font-bold mb-4 text-white">All Orders</h1>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-white">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-zinc-800 p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="text-lg text-white">{order.book ? order.book.title : "Book title unavailable"}</p>
                <p className="text-sm text-gray-400">Ordered by: {order.user ? order.user.username : "Unknown User"}</p>
                <p className="text-sm text-gray-400">Status: {order.status || "Pending"}</p>
              </div>
              <div className="flex gap-4">
                {/* Dropdown for status update */}
                <select
                  value={order.status}
                  onChange={(e) => handleUpdateStatus(order._id, e.target.value)} // Only update this order
                  className="bg-zinc-600 text-white p-2 rounded-lg"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Canceled">Canceled</option>
                </select>
                <button
                  onClick={() => handleUserData(order._id)}
                  className="text-yellow-500 hover:text-yellow-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteOrder(order._id)}  // Trigger deletion on click
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllOrders;
