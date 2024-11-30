const router = require("express").Router();
const {authenticateToken} = require("./userAuth");
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
  

//get all order --admin only
router.get("/get-all-orders",authenticateToken,async(req,res) => {
    try {
        const userData = (await Order.find())
        .populate({path: "book",})
        .populate({path: "user",})
        .sort({createdAt: -1});
        return res.json({
            status: "Success",
            data: userData,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "An error occurred"});
    }
});

//update order --admin only
router.put("/update-status/:id",authenticateToken, async(req, res) => {
    try {
        const { id } = req.params;
        await Order.findByIdAndUpdate(id, {status: req.body.status});
        return res.json({
            status: "Success",
            message: "Status updated successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "An error occurred"});
    }
});
module.exports = router;