const express= require('express');
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/",orderController.addOrder);
router.put("/:idOrder",orderController.updateOrder);


module.exports=router;