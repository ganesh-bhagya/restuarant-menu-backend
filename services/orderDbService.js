const db = require("../db/db");

const addOrder = (
  Order_Code,
  Date,
  Start_Time,
  End_Time,
  Expected_Duration
) => {
  const sql = `INSERT INTO orders (Order_Code, Date, Start_Time,End_Time,Expected_Duration) VALUES (?,?,?,?,?)`;
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [Order_Code, Date, Start_Time, End_Time, Expected_Duration],
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
          console.log(results[0].Order_Code);
        } else {
          resolve("001");
        }
      }
    });
  });
};

const updateOrder = (idOrder, Start_Time, End_Time, Expected_Duration) => {
  const sql = `UPDATE orders SET Start_Time = ? ,End_Time = ? ,Expected_Duration= ? WHERE idOrder = ?`;
  return new Promise((resolve, reject) => {
    db.query(
      sql,
      [Start_Time, End_Time, Expected_Duration, idOrder],
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

const getAllPendingOrders = () => {
  const sql = `SELECT * FROM orders WHERE Status NOT IN (?, ?) ORDER BY idOrder ASC`;
  return new Promise((resolve, reject) => {
    db.query(sql, [2, 3], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
const getAllOrders = () => {
  const sql = `SELECT * FROM orders ORDER BY idOrder ASC`;
  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
const getOrdersByDate = (Date) => {
  const sql = `SELECT * FROM orders WHERE Date = ? ORDER BY idOrder ASC`;
  return new Promise((resolve, reject) => {
    db.query(sql, [Date], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getAllCompletedOrders = () => {
  const sql = `SELECT * FROM orders WHERE Status = ? ORDER BY idOrder ASC`;
  return new Promise((resolve, reject) => {
    db.query(sql, [2], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const updateOrderStatus = (idOrder, Status) => {
  const sql = `UPDATE orders SET Status = ? WHERE idOrder = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [Status, idOrder], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const updateOrderEndTime = (idOrder, End_Time) => {
  const sql = `UPDATE orders SET End_Time = ? WHERE idOrder = ?`;
  return new Promise((resolve, reject) => {
    db.query(sql, [End_Time, idOrder], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getOrderByID = (idOrder) => {
  const sql = `
    SELECT * FROM orders WHERE idOrder = ?;
  `;

  return new Promise((resolve, reject) => {
    db.query(sql, [idOrder], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  addOrder,
  getLatestOrderCode,
  updateOrder,
  getAllPendingOrders,
  getAllCompletedOrders,
  updateOrderStatus,
  getOrderByID,
  getAllOrders,
  updateOrderEndTime,
  getOrdersByDate
};
