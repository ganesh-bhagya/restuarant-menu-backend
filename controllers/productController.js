const productDbService = require("../services/productDbService");

const addProduct = async (req, res) => {
  try {
    const { Name, Description } = req.body;
    const File_Path = req.file ? req.file.filename : null;
    const result = await productDbService.addProduct(
      Name,
      Description,
      File_Path
    );
    res
      .status(201)
      .json({ message: "Product adding completed!", results: result });
  } catch (err) {
    console.error(err);
    res
      .status(401)
      .json({ message: "Somthing went wrong when adding product!" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const results = await productDbService.getAllProducts();
    res.status(201).json(results);
  } catch (err) {
    console.error(err);
    res
      .status(401)
      .json({ message: "Somthing went wrong when fetching the products!" });
  }
};

const getProductByID = async (req, res) => {
  try {
    const { productID } = req.params;
    const result = await productDbService.getProductByID(productID);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res
      .status(401)
      .json({
        message: "Somthing went wrong when fetching the product by ID!",
      });
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  getProductByID,
};
