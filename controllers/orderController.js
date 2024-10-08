const orderDbService = require("../services/orderDbService");
const orderHasProductsDbService = require("../services/orderHasProductsDbService");

const getCurrentTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");
  const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
};

const getCurrentDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const addOrder = async (req, res) => {
  try {
    const { product_list } = req.body;
    const Start_Time = new Date();
    let Expected_Duration = product_list.reduce((acc, product) => {
      return acc + parseInt(product.Duration, 10);
    }, 0);
    const End_Time = new Date(Start_Time.getTime() + Expected_Duration * 60000);
    const Order_Code = await orderDbService.getLatestOrderCode();
    const add_result = await orderDbService.addOrder(
      Order_Code,
      getCurrentDate(),
      Start_Time,
      End_Time,
      Expected_Duration
    );
    const insertedID = add_result.insertId;
    const itemPromises = product_list.map((product) => {
      return orderHasProductsDbService.addOrderHasProduct(
        insertedID,
        product.productID,
        product.Instructions,
        Expected_Duration,
        product.Quantity
      );
    });
    await Promise.all(itemPromises);

    const io = req.app.get("io");
    if (io) {
      io.emit("orderAdded", {
        idOrder: insertedID,
        Order_Code,
        Start_Time,
        End_Time,
        Expected_Duration,
        product_list
      });
    } else {
      console.error("WebSocket server instance 'io' is not found");
    }

    res.status(201).json({ message: "Order adding completed!" });
  } catch (err) {
    console.error(err);
    res
      .status(401)
      .json({ message: "Something went wrong when adding an order!" });
  }
};

// Similarly update other methods if needed.

const updateOrder = async (req, res) => {
  try {
    const { product_list } = req.body;
    const { idOrder } = req.params;
    const Start_Time = new Date();
    let Expected_Duration = product_list.reduce((acc, product) => {
      return acc + parseInt(product.Duration, 10);
    }, 0);
    const End_Time = new Date(Start_Time.getTime() + Expected_Duration * 60000);

    const order_table_update_result = await orderDbService.updateOrder(
      idOrder,
      Start_Time,
      End_Time,
      Expected_Duration
    );
    if (order_table_update_result.affectedRows === 0) {
      console.error("No records found to update!");
      return res.status(401).json({ message: "No Records found to update!" });
    }
    const itemUpdates = product_list.map((product) => {
      return orderHasProductsDbService.updateOrderHasProduct(
        idOrder,
        product.productID,
        product.Instructions,
        product.Duration,
        product.Quantity
      );
    });
    await Promise.all(itemUpdates);

    const io = req.app.get("io");
    io.emit("orderUpdated", {
      idOrder,
      Start_Time,
      End_Time,
      Expected_Duration,
      product_list
    });

    res.status(200).json({ message: "Order updated successfully!" });
  } catch (err) {
    console.error(err);
    res
      .status(401)
      .json({ message: "Something went wrong when updating the order!" });
  }
};

const getAllPendingOrders = async (req, res) => {
  try {
    let data = [];
    const results = await orderDbService.getAllPendingOrders();
    await Promise.all(
      results.map(async (order) => {
        const productList =
          await orderHasProductsDbService.getOrderHasProductsById(
            order.idOrder
          );
        order.product_list = productList;
        data.push(order);
      })
    );

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong when fetching pending orders!" });
  }
};
const getAllOrders = async (req, res) => {
  try {
    let data = [];
    const results = await orderDbService.getAllOrders();
    await Promise.all(
      results.map(async (order) => {
        const productList =
          await orderHasProductsDbService.getOrderHasProductsById(
            order.idOrder
          );
        order.product_list = productList;
        data.push(order);
      })
    );

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong when fetching pending orders!" });
  }
};
const getOrdersByDate = async (req, res) => {
  try {
    const { Date } = req.params;
    let data = [];
    const results = await orderDbService.getOrdersByDate(Date);
    await Promise.all(
      results.map(async (order) => {
        const productList =
          await orderHasProductsDbService.getOrderHasProductsById(
            order.idOrder
          );
        order.product_list = productList;
        data.push(order);
      })
    );

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong when fetching pending orders!" });
  }
};

const getAllCompletedOrders = async (req, res) => {
  try {
    let data = [];
    const results = await orderDbService.getAllCompletedOrders();
    await Promise.all(
      results.map(async (order) => {
        const productList =
          await orderHasProductsDbService.getOrderHasProductsById(
            order.idOrder
          );
        order.product_list = productList;
        data.push(order);
      })
    );

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong when fetching completed orders!"
    });
  }
};

const getLatestOrderCode = async (req, res) => {
  try {
    const code = await orderDbService.getLatestOrderCode();
    res.status(201).json({ "the code : ": code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { idOrder } = req.params;
    const { Status } = req.body;
    const result = await orderDbService.updateOrderStatus(idOrder, Status);

    if (Status === 2) {
      await orderDbService.updateOrderEndTime(idOrder, getCurrentTime());
    }

    res.status(200).json({ message: "Status updated!" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong when updating the status!" });
  }
};

const getOrderByID = async (req, res) => {
  try {
    let data = [];
    const { idOrder } = req.params;

    const results = await orderDbService.getOrderByID(idOrder);

    await Promise.all(
      results.map(async (order) => {
        const productList =
          await orderHasProductsDbService.getOrderHasProductsById(
            order.idOrder
          );
        order.product_list = productList;
        data.push(order);
      })
    );

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong when fetching the order!" });
  }
};

module.exports = {
  addOrder,
  updateOrder,
  getAllPendingOrders,
  getAllCompletedOrders,
  getLatestOrderCode,
  updateOrderStatus,
  getOrderByID,
  getAllOrders,
  getOrdersByDate
};
