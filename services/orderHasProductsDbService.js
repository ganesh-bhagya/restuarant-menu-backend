const db = require("../db/db");

const addOrderHasProduct = (
  insertedID,
  productID,
  Instructions,
  Expected_Duration,
  Quantity
) => {
  const sql = `INSERT INTO order_has_products (idOrder,Product_Id,Instructions,Duration,Quantity) VALUES (?,?,?,?,?)`;
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [insertedID, productID, Instructions, Expected_Duration, Quantity],
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

const updateOrderHasProduct = (
  idOrder,
  Product_Id,
  Instructions,
  Duration,
  Quantity
) => {
  const sql = `UPDATE order_has_products SET Product_Id=?,Instructions=?,Duration=?,Quantity=? WHERE idOrder=? `;
  console.log("Duration is : ",Duration);
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [Product_Id, Instructions, Duration, Quantity, idOrder],
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
module.exports = {
  addOrderHasProduct,
  updateOrderHasProduct,
};
