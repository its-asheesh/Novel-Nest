
const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

//add book to favourite
router.put("/add-book-to-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.body;
    const { id } = req.headers;

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required." });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.favourites.includes(bookId)) {
      return res.json({ message: "Book is already in favourites." });
    }

    await User.findByIdAndUpdate(id, { $push: { favourites: bookId } });
    res.status(200).json({ message: "Book added to favourites successfully." });
  } catch (error) {
    console.error("Error adding to favourites:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


//delete favourite books of a particular user
router.delete("/remove-book-to-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.body; // Extract bookId from the request body
    const { id } = req.headers; // Extract user ID from headers

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required." });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isBookFavourite = user.favourites.includes(bookId);
    if (!isBookFavourite) {
      return res.status(400).json({ message: "Book is not in favourites." });
    }

    await User.findByIdAndUpdate(id, { $pull: { favourites: bookId } });
    res.status(200).json({ message: "Book removed from favourites successfully." });
  } catch (error) {
    console.error("Error removing book from favourites:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});


//delete book to favourite
router.get("/get-favourite-books",authenticateToken, async(req, res) => {
    try {
       const { id } = req.headers;
       const userData = await User.findById(id).populate("favourites");
       const favouriteBooks = userData.favourites;
       return res.json({
        status: "Success",
        data: favouriteBooks,
       });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "An error occurred"});
    }
});
module.exports = router;