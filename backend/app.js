const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./conn/conn");

const User = require("./routes/user");
const Books = require("./routes/book");
const Favourite = require("./routes/favourite");
const Cart = require("./routes/cart");
const Order = require("./routes/order");

const app = express();

// Enable CORS for all origins (development and production)
app.use(
  cors({
    origin: true, // Dynamically handles the `Access-Control-Allow-Origin` based on the request origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json()); // Middleware to parse JSON

// Route Handlers
app.use("/api/v1", User);
app.use("/api/v1", Books);
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use("/api/v1", Order);

// Server Listener
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => {
  console.log(`Server Started at http://localhost:${PORT}`);
});
