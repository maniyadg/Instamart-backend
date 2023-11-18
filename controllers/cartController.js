const userModel = require('../models/userModel')
const catchAsyncError = require("../middlewares/catchAsyncError.js");
const cartModel = require("../models/cartModel.js");
const ErrorHandler = require('../utills/errorHandler');

// create Cart
const createnewCart = catchAsyncError(async (req, res ,next) => {
    try {
      const product = req.params.id
      const user = req.user._id

      const extistingUser = await cartModel.findOne({user})
      const extistingProduct = await cartModel.findOne({product} )

      if (extistingProduct && extistingUser) {
        return next(new ErrorHandler('Product already Exists', 400))

      }

      const quantity = req.body.quantity
      const cart = await cartModel.create({product , user , quantity });

      res.status(200).send({
        success: true,
        message: "Cart Item Added",
        cart,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Eror while getitng single product",
        error,
      });
    }
  });


// get prdocyst by user
const getCart = catchAsyncError(async (req, res) => {
    try {
      const user = await userModel.findOne({ _id: req.user._id });
      const cart = await cartModel.find({ user }).populate("product");
      res.status(200).send({
        success: true,
        user,
        cart,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        error,
        message: "Error While Getting products",
      });
    }
  });

 
// delete product
const deleteProduct = catchAsyncError(async (req,res) => {
   const product = await cartModel.findByIdAndDelete(req.params.id);
   res.status(200).send({
    success: true,
    message: "Product Deleted successfully",
  });
})


  module.exports = { createnewCart , getCart,deleteProduct }