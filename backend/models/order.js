const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true, // Ensure user ID is always provided
    },
    book: {
      type: mongoose.Types.ObjectId,
      ref: "books",
      required: true, // Ensure book ID is always provided
    },
    status: {
      type: String,
      default: "Order Placed", // Default order status
      enum: ["Order Placed", "Out for delivery", "Delivered", "Canceled"], // Valid statuses
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

module.exports = mongoose.model("Order", orderSchema);
