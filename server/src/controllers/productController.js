const productModel = require("../models/productModel");
const { getImage } = require("./aws");
const jwt = require("jsonwebtoken");
const {
  isValidObjectId,
  isValidString,
  isValidBody,
} = require("../validators/validations");

//===========================// create product //===========================================

const createProduct = async (req, res) => {
  try {
    let ProductData = req.body;

    if (Object.keys(ProductData).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "body cant be empty" });

    let { Title, Highlights, Description, Stock } = ProductData;

    if (!Title)
      return res
        .status(400)
        .send({ status: false, message: "Pls provide title" });
    if (Highlights.length <= 0)
      return res
        .status(400)
        .send({ status: false, messagse: "pls provide highlights" });

    let finalProduct = await productModel.create(ProductData);
    return res
      .status(201)
      .send({ status: true, message: "Success", data: finalProduct });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

//=========================// get product by query //=========================================

const getProductByQuery = async function (req, res) {
  try {
    let filters = req.query;
    // let getProductByQuery = await productModel.aggregate([
    //   {$group :{ _id: "$Category", data: { $push: "$$ROOT" } }},
    // ]);

    let getProductByQuery = await productModel.find();
    return res
      .status(200)
      .send({ status: true, message: "Success", data: getProductByQuery });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};




const getProductByFilter = async function (req, res) {
  try {
    let {title, category} = req.query;
    let filter ={Title:{$regex: title}}

    if(category != "All"){
      filter.Category = category
    };
  
    let getProductbyfilter = await productModel.find(filter).limit(10);

    return res
      .status(200)
      .send({ status: true, message: "Success", data: getProductbyfilter });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

//==============================// get product by product id //=================================

const getProductById = async function (req, res) {
  try {
    const productId = req.params.productId;
    if (!isValidObjectId(productId)) {
      return res
        .status(400)
        .send({ status: false, message: " Enter a valid productId" });
    }
    const productById = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });

    if (!productById) {
      return res.status(404).send({
        status: false,
        message: "No product found by this Product id",
      });
    }
    return res
      .status(200)
      .send({ status: true, message: "Success", data: productById });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

//============================================= UPDATE PRODUCT ==========================================//
const updateProduct = async (req, res) => {
  try {
    let productId = req.params.productId;
    let image = req.files;
    let ProductData = req.body;
    if (Object.keys(ProductData).length == 0) {
      return res.status(400).send({
        status: false,
        message: "Pls provide atleast one field to Update",
      });
    }
    if (!isValidObjectId(productId))
      return res
        .status(400)
        .send({ status: false, message: " Enter a valid productId" });
    let {
      title,
      description,
      isFreeShipping,
      price,
      availableSizes,
      style,
      installments,
    } = ProductData;
    let obj = {};
    if (title) {
      if (!isValidString(title))
        return res
          .status(400)
          .send({ status: false, message: "Please provide valid title" });
      let duplicateTitle = await productModel.findOne({ title });
      if (duplicateTitle)
        return res
          .status(400)
          .send({ status: false, msg: "Title is already exist" });
      obj.title = title;
    }
    if (description) {
      if (!isValidString(description))
        return res
          .status(400)
          .send({ status: false, message: "Please provide description" });
      obj.description = description;
    }
    if (isFreeShipping) {
      isFreeShipping = JSON.parse(isFreeShipping);
      if (typeof isFreeShipping != "boolean") {
        return res.status(400).send({
          status: false,
          message: "Pls provide only boolean value in isFreeShipping",
        });
      }
      obj.isFreeShipping = isFreeShipping;
    }
    if (price) {
      if (!/^\d+(,\d{1,2})?$/.test(price))
        return res
          .status(400)
          .send({ status: false, message: "Price only numeric value" });
      price = Number(price);
      obj.price = price.toFixed(2);
    }
    if (availableSizes) {
      let arr2 = ["S", "XS", "M", "X", "L", "XXL", "XL"];
      let arr = availableSizes.trim().split(",");
      const multipleExist = arr.every((value) => {
        return arr2.includes(value);
      });

      if (multipleExist == false) {
        return res.status(400).send({
          status: false,
          message: "pls provide valid size(S, XS, M, X, L, XXL, XL)",
        });
      }
      obj.availableSizes = arr;
    }
    if (style) {
      if (!isValidString(style))
        return res
          .status(400)
          .send({ status: false, message: "Please provide valid style" });
      obj.style = style;
    }
    if (installments) {
      obj.installments = installments;
    }
    const productById = await productModel.findById(productId);

    if (!productById || productById.isDeleted == true) {
      return res.status(404).send({
        status: false,
        message: "No product found by this Product id",
      });
    }
    if (image.length != 0) {
      obj.productImage = await getImage(image);
    }
    let updatedData = await productModel.findByIdAndUpdate(
      productId,
      { $set: obj },
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, message: "Update sccessuly", data: updatedData });
  } catch (err) {
    return res.status(500).send({ status: false, error: err.message });
  }
};

//================================================== DELETE PRODUCT =======================================//
const deleteProductById = async function (req, res) {
  try {
    let productId = req.params.productId;
    if (!isValidObjectId(productId))
      return res
        .status(400)
        .send({ status: false, message: "Pls provide a valid Product Id" });
    let checkProduct = await productModel.findOne({
      _id: productId,
      isDeleted: false,
    });
    if (!checkProduct)
      return res.status(404).send({
        status: false,
        message: "No Product exists with this ProductId",
      });
    let deleteProductById = await productModel.findByIdAndUpdate(
      productId,
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );
    return res
      .status(200)
      .send({ status: true, message: "Success", data: deleteProductById });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

module.exports = {
  createProduct,
  getProductByQuery,
  getProductById,
  deleteProductById,
  updateProduct,
  getProductByFilter
};
