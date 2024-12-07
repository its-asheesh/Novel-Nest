const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const Book = require("../models/book");
const Order = require("../models/order");
const User = require("../models/user");

// Place Order Route
router.post("/place-order", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers; // User ID
        const { order } = req.body; // Array of cart items

        if (!order || order.length === 0) {
            return res.status(400).json({ message: "Cart is empty." });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const orderPromises = order.map((item) =>
            Order.create({
                user: id,
                book: item._id,
                price: item.price,
            })
        );

        await Promise.all(orderPromises);

        user.cart = []; // Clear user cart
        await user.save();

        res.status(201).json({ message: "Order placed successfully!" });
    } catch (error) {
        console.error("Error in /place-order:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get Order History
router.get("/get-order-history", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;

        const orders = await Order.find({ user: id }).populate("book");
        res.status(200).json({ status: "Success", data: orders });
    } catch (error) {
        console.error("Error in /get-order-history:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get all orders -- Admin only
router.get("/get-all-orders", authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("book")  // Populate the book field
            .populate("user")  // Optionally, populate the user field
            .sort({ createdAt: -1 });

        if (!orders) {
            return res.status(404).json({ message: "No orders found" });
        }

        return res.json({ status: "Success", data: orders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        return res.status(500).json({ message: "An error occurred while fetching orders" });
    }
});

// Update order status -- Admin only
router.put("/update-status/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await Order.findByIdAndUpdate(id, { status: req.body.status });
        return res.json({
            status: "Success",
            message: "Status updated successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

// Delete order -- Admin only
router.delete("/delete-order", authenticateToken, async (req, res) => {
    try {
        const { orderId } = req.body;  // Order ID to delete

        if (!orderId) {
            return res.status(400).json({ message: "Order ID is required" });
        }

        // Find and delete the order
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: "An error occurred while deleting the order" });
    }
});

// Get specific order details -- Admin only
router.get("/get-order/:id", authenticateToken, async (req, res) => {
  try {
      const { id } = req.params;

      const order = await Order.findById(id).populate("book").populate("user");
      if (!order) {
          return res.status(404).json({ message: "Order not found" });
      }

      res.json({ status: "Success", data: order });
  } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "An error occurred while fetching order details" });
  }
});


module.exports = router;
