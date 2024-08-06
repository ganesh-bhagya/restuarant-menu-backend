const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const port = 8000;

// CORS options
const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
app.use(
  "/upload-products",
  express.static(path.join(__dirname, "uploadProduct"))
);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Create HTTP server and attach socket.io server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // Emit events as needed
});

// Start the server
server.listen(port, () => {
  console.log(`The backend is running on port number ${port}`);
});
