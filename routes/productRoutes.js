const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const uploadProduct = require('../middleware/uploadProduct');

router.post("/",uploadProduct.single("File_Path"),productController.addProduct);
router.get("/",productController.getAllProducts);
router.get("/:productID",productController.getProductByID);

module.exports=router