const { error } = require('console');
const orderModel = require('../models/orderModel')
const crypto = require('crypto')
const Razorpay = require('razorpay')

// razorpay
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRETKEY,
});

const checkout = async (req, res) => {

  try {
    const options = {
      amount: Number(req.body.amount * 100),
      currency: "INR",
    };
    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log("error :" , error)
  }
}

const paymentVerification = async (req, res) => {

  try {
    const { product, razorpay_order_id, razorpay_payment_id, razorpay_signature , amount , shippingInfo , quantity } =
      req.body;
console.log(product)
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRETKEY)
      .update(body.toString())
      .digest("hex");

      console.log(expectedSignature)


    const isAuthentic = expectedSignature === razorpay_signature;


    try {
      if (isAuthentic) {
        // Database comes here
  
        await orderModel.create({
          shippingInfo:shippingInfo,
          orderItems:[{
            quantity:quantity,
            product:product
          }],
          user: req.user._id,
          payment: {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          }
  
        });
        res.status(200).json({
          success: true,
        });
        // res.redirect(
        //   `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
        // );
      
      } 
    } catch (error) {
      console.log(error)
    }

  } catch (error) {
    console.log("error :" , error)
  }
};


module.exports = { checkout, paymentVerification }