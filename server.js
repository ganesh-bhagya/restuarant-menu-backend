const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const app = express();
const port = 8000;
dotenv.config();
const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// Routes
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
app.use("/upload-products", express.static("uploadProduct"));
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
