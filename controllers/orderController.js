const orderDbService = require("../services/orderDbService");
const orderHasProductsDbService = require("../services/orderHasProductsDbService");
const addOrder = async (req, res) => {
  try {
    const { product_list } = req.body;
    const Start_Time = new Date();
    let Expected_Duration = product_list.reduce((acc, product) => {
      return acc + parseInt(product.Duration, 10);
    }, 0);
    const End_Time = new Date(Start_Time.getTime() + Expected_Duration * 60000);
    const Order_Code = await orderDbService.getLatestOrderCode();
    console.log("The order code is : " + Order_Code);
    const add_result = await orderDbService.addOrder(
      Order_Code,
      Start_Time,
      End_Time,
      Expected_Duration
    );
    const insertedID = add_result.insertId;
    console.log("The inserted id is ", insertedID);
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
    res.status(201).json({ message: "Order adding completed!" });
  } catch (err) {
    console.error(err);
    res
      .status(401)
      .json({ message: "Somthing went Wrong when adding an order!" });
  }
};

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

    res.status(200).json({ message: "Order updated successfully!" });
  } catch (err) {
    console.error(err);
    res
      .status(401)
      .json({ message: "Somthing went Wrong when updating the order!" });
  }
};


const getAllPendingOrders = async (req, res) => {
  try {
    let data = [];
    const results = await orderDbService.getAllPendingOrders();
    await Promise.all(
      results.map(async (order) => {
        const productList = await orderHasProductsDbService.getOrderHasProductsById(order.idOrder);
        console.log("The product list for order ID", order.idOrder, "is:", productList);
        order.product_list = productList;
        data.push(order);
      })
    );

    // Return the complete data array
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong when fetching pending orders!" });
  }
}

const getAllCompletedOrders = async (req, res) => {
  try {
    let data = [];
    const results = await orderDbService.getAllCompletedOrders();
    await Promise.all(
      results.map(async (order) => {
        const productList = await orderHasProductsDbService.getOrderHasProductsById(order.idOrder);
        console.log("The product list for order ID", order.idOrder, "is:", productList);
        order.product_list = productList;
        data.push(order);
      })
    );

    // Return the complete data array
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong when fetching pending orders!" });
  }
}

const getLatestOrderCode = async(req,res) =>{
  try{
    const code = await orderDbService.getLatestOrderCode();
    res.status(201).json({"the code : ":code});


  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  }

}


const updateOrderStatus=async(req,res)=>{
  try{
    const {idOrder}= req.params;
    const result = await orderDbService.updateOrderStatus(idOrder);
    res.status(200).json({message:"Status updated!"});

  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Something went wrong when updating the status!" });
  }
}



module.exports = {
  addOrder,
  updateOrder,
  getAllPendingOrders,
  getAllCompletedOrders,
  getLatestOrderCode,
  updateOrderStatus
};
