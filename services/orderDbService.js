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


const updateOrder = async (idOrder, Start_Time, End_Time, Expected_Duration)=>{
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

module.exports = {
  addOrder,
  getLatestOrderCode,
  updateOrder
};
