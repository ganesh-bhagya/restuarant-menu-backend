const express = require('express');
const db = require('./db/db');
const app = express();
const cors = require("cors");
const port = 8000;
const path= require('path');
const corsOptions = {
    origin: "*",
  };
app.use(cors(corsOptions));
app.use(express.json());
const productRoutes= require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
app.use('/upload-products', express.static(path.join(__dirname, 'uploadProduct')));
app.use("/api/products",productRoutes);
app.use("/api/orders",orderRoutes);

app.listen(port,()=>{
    console.log(`The backend is running on port number ${port}`);
})