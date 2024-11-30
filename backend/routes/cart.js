const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

// Add book to cart
router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.body; // Use body for bookId
    const { id } = req.headers;

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required." });
    }

    const userData = await User.findById(id);
    const isBookInCart = userData.cart.includes(bookId);

    if (isBookInCart) {
      return res.json({ status: "Success", message: "Book is already in cart." });
    }

    await User.findByIdAndUpdate(id, { $push: { cart: bookId } });
    return res.status(200).json({ status: "Success", message: "Book added to cart." });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return res.status(500).json({ message: "An error occurred." });
  }
});

// Remove book from cart
router.delete("/remove-from-cart/:bookId", authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.params; // Get bookId from URL params
    const { id } = req.headers;

    const userData = await User.findById(id);
    if (!userData.cart.includes(bookId)) {
      return res.status(400).json({ message: "Book is not in the cart." });
    }

    await User.findByIdAndUpdate(id, { $pull: { cart: bookId } });
    return res.status(200).json({ status: "Success", message: "Book removed from cart." });
  } catch (error) {
    console.error("Error removing from cart:", error);
    return res.status(500).json({ message: "An error occurred." });
  }
});

// Get user cart
router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const userData = await User.findById(id).populate("cart");
    if (!userData) {
      return res.status(404).json({ message: "User not found." });
    }

    const cart = userData.cart.reverse();
    return res.status(200).json({ status: "Success", data: cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ message: "An error occurred." });
  }
});

module.exports = router;
