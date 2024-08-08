const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/", orderController.addOrder);
router.put("/:idOrder", orderController.updateOrder);
router.get("/get-all-pending-orders", orderController.getAllPendingOrders);
router.get("/get-all-completed-orders", orderController.getAllCompletedOrders);
router.get("/get-all-orders", orderController.getAllOrders);
router.get("/get-orders-by-date/:Date", orderController.getOrdersByDate);
router.get("/get-latest-order-code", orderController.getLatestOrderCode);
router.put("/update-order-status/:idOrder", orderController.updateOrderStatus);
router.get("/get-order-by-id/:idOrder", orderController.getOrderByID);

module.exports = router;
