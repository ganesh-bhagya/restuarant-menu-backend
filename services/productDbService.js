const db = require("../db/db");

const addProduct = (name, description, File_Path) => {
  const sql =
    "INSERT into products (Name,Description,File_Path) Values (?,?,?)";
  return new Promise((resolve, reject) => {
    db.query(sql, [name, description, File_Path], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const getAllProducts = () => {
  const sql = "SELECT * FROM products";
  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } else {
        const transformedResults = results.map((result) => ({
          ...result,
          File_Url: result.File_Path
            ? `http://localhost:8000/upload-products/${result.File_Path}`
            : null,
        }));
        resolve(transformedResults);
      }
    });
  });
};

const getProductByID = (productID) => {
  const sql = "SELECT * FROM products WHERE productID = ? ";
  return new Promise((resolve, reject) => {
    db.query(sql, [productID], (err, results) => {
      if (err) {
        reject(err);
      } else {
        const transformedResults = results.map((result) => ({
          ...result,
          File_URL: result.File_Path
            ? `http://localhost:8000/upload-products/${result.File_Path}`
            : null,
        }));
        resolve(transformedResults);
      }
    });
  });
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductByID,
};
