const db = require("../db/db");

const addOrder = (Order_Code, Start_Time, End_Time, Expected_Duration) => {
  const sql = `INSERT INTO orders (Order_Code,Start_Time,End_Time,Expected_Duration) VALUES (?,?,?,?)`;
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [Order_Code, Start_Time, End_Time, Expected_Duration],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

const getLatestOrderCode = () => {
  const sql = `SELECT Order_Code FROM orders ORDER BY Order_Code DESC LIMIT 1`;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length > 0) {
          resolve(results[0].Order_Code + 1);
        } else {
          resolve("001");
        }
      }
    });
  });
};


const updateOrder = (idOrder, Start_Time, End_Time, Expected_Duration)=>{
    const sql=`UPDATE orders SET Start_Time = ? ,End_Time = ? ,Expected_Duration= ? WHERE idOrder = ?`;
    return new Promise((resolve,reject)=>{
        db.query(sql,[Start_Time, End_Time, Expected_Duration,idOrder],(err,results)=>{
            if(err){
                reject(err);
            }else{
                resolve(results);
            }
        })
    })

}

const getAllPendingOrders = () =>{
  const sql=`SELECT * FROM orders WHERE Status = ? ORDER BY idOrder ASC`;
  return new Promise((resolve,reject)=>{
    db.query(sql,[0],(err,results)=>{
      if(err){
        reject(err);
      }else{
        resolve(results);
      }
    })
  })

}

const getAllCompletedOrders = () =>{
  const sql=`SELECT * FROM orders WHERE Status = ? ORDER BY idOrder ASC`;
  return new Promise((resolve,reject)=>{
    db.query(sql,[1],(err,results)=>{
      if(err){
        reject(err);
      }else{
        resolve(results);
      }
    })
  })

}

const updateOrderStatus = (idOrder)=>{
  const sql=`UPDATE orders SET Status = CASE WHEN Status = 1 THEN 0 ELSE 1 END WHERE idOrder = ?`;
  return new Promise((resolve,reject)=>{
    db.query(sql,[idOrder],(err,results)=>{
      if(err){
        reject(err);
      }else{
        resolve(results);
      }
    })
  })

}

const getOrderByID = (idOrder) => {
  const sql = `
    SELECT o.*, p.productID, p.Name, p.Description, p.File_Path, p.Duration AS ProductDuration,
           ohp.Instructions, ohp.Duration AS ItemDuration, ohp.Quantity
    FROM orders o
    INNER JOIN order_has_products ohp ON o.idOrder = ohp.idOrder
    INNER JOIN products p ON ohp.Product_Id = p.productID
    WHERE o.idOrder = ?;
  `;

  return new Promise((resolve, reject) => {
    db.query(sql, [idOrder], (err, results) => {
      if (err) {
        reject(err);
      } else {
        // Map through results to append the URL to each
        const enhancedResults = results.map(result => ({
          ...result,
          File_URL: `http://localhost:8000/upload-products/${result.File_Path}`
        }));
        resolve(enhancedResults);
      }
    });
  });
}

module.exports = {
  addOrder,
  getLatestOrderCode,
  updateOrder,
  getAllPendingOrders,
  getAllCompletedOrders,
  updateOrderStatus,
  getOrderByID
};
