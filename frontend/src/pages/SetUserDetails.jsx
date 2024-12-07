import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const SetUserDetails = () => {
  const { id } = useParams(); // Order ID from URL
  const [order, setOrder] = useState(null); // Order details
  const [status, setStatus] = useState(""); // Current status
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:1000/api/v1/get-order/${id}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        setOrder(response.data.data);
        setStatus(response.data.data.status); // Initialize status
      } catch (err) {
        console.error("Failed to fetch order details:", err);
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, token]);

  // Update order status
  const handleUpdateStatus = async () => {
    try {
      const response = await axios.put(
        `http://localhost:1000/api/v1/update-status/${id}`,
        { status },
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      navigate("/admin/allorders"); // Redirect to All Orders after updating
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Failed to update status.");
    }
  };

  if (loading) {
    return <div className="text-white text-center">Loading order details...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="bg-zinc-900 p-6 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-4">Edit Order</h1>
      {order && (
        <div className="bg-zinc-800 p-6 rounded-lg space-y-4">
          {/* User Details */}
          <div>
            <h2 className="text-xl font-bold">User Details</h2>
            <p>
              <strong>Name:</strong> {order.user.username}
            </p>
            <p>
              <strong>Email:</strong> {order.user.email}
            </p>
          </div>

          {/* Book Details */}
          <div>
            <h2 className="text-xl font-bold">Book Details</h2>
            <p>
              <strong>Title:</strong> {order.book.title}
            </p>
            <p>
              <strong>Price:</strong> ₹ {order.book.price}
            </p>
          </div>

          {/* Order Details */}
          <div>
            <h2 className="text-xl font-bold">Order Details</h2>
            <p>
              <strong>Current Status:</strong> {order.status}
            </p>
            <p>
              <strong>Order Placed At:</strong> {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Update Status */}
          <div>
            <label htmlFor="status" className="block mb-2">
              Update Status:
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-zinc-600 text-white p-2 rounded-lg w-full"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>

          <button
            onClick={handleUpdateStatus}
            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
          >
            Update Status
          </button>
        </div>
      )}
    </div>
  );
};

export default SetUserDetails;
