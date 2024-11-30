const express = require("express");
const router = express.Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/book");
const { authenticateToken } = require("./userAuth");

// Add book -- admin only
router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    // Validate admin user
    const { id } = req.headers;
    if (!id) {
      return res.status(400).json({ message: "User ID is required in headers" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    // Validate required fields for the book
    const { url, title, author, price, desc, language } = req.body;
    if (!url || !title || !author || !price || !desc || !language) {
      return res.status(400).json({ message: "All fields are required to add a book" });
    }

    // Create and save the new book
    const book = new Book({ url, title, author, price, desc, language });
    await book.save();

    res.status(201).json({ message: "Book added successfully" });
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update book -- admin only
router.put("/update-book", authenticateToken, async (req, res) => {
    try {
      // Validate admin user
      const { id } = req.headers; // Correct header variable name
      if (!id) {
        return res.status(400).json({ message: "User ID is required in headers" });
      }
  
      const user = await User.findById(id); // Correct user lookup
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admin only." });
      }
  
      // Validate required fields for the book
      const { bookid, url, title, author, price, desc, language } = req.body;
      if (!bookid || !url || !title || !author || !price || !desc || !language) {
        return res.status(400).json({ message: "All fields are required to update the book" });
      }
  
      // Update the existing book
      const updatedBook = await Book.findByIdAndUpdate(
        bookid, // Use the bookid from the request body
        { url, title, author, price, desc, language },
        { new: true } // Ensure the updated book is returned
      );
  
      if (!updatedBook) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      res.status(200).json({ message: "Book updated successfully", book: updatedBook });
    } catch (error) {
      console.error("Error updating book:", error); // Correct error message
      res.status(500).json({ message: "Internal server error" });
    }
});

// Delete book -- admin only
router.delete("/delete-book", authenticateToken, async (req, res) => {
    try {
      // Validate admin user
      const { id } = req.headers; // Correct header variable name
      if (!id) {
        return res.status(400).json({ message: "User ID is required in headers" });
      }
  
      const user = await User.findById(id); // Correct user lookup
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admin only." });
      }
  
      // Validate required fields for the book
      const { bookid } = req.body; // Only need the bookid to delete
      if (!bookid) {
        return res.status(400).json({ message: "Book ID is required to delete the book" });
      }
  
      // Delete the book
      const deletedBook = await Book.findByIdAndDelete(bookid); // Just the bookid is needed for deletion
  
      if (!deletedBook) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      res.status(200).json({ message: "Book deleted successfully", book: deletedBook });
    } catch (error) {
      console.error("Error deleting book:", error); // Correct error message
      res.status(500).json({ message: "Internal server error" });
    }
});

// get all books
router.get("/get-all-books",async(req,res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1});
        return res.json({
            status: "Success",
            data: books,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "An error occurred"});
        
    }
});

//get recently added books limit 4
router.get("/get-recent-books",async(req,res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1}).limit(4);
        return res.json({
            status: "Success",
            data: books,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "An error occurred"});
        
    }
});

//get book by id
router.get("/get-book-by-id/:id",async(req,res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        return res.json({
            status: "Success",
            data: book,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "An error occurred"});
        
    }
});

module.exports = router;
