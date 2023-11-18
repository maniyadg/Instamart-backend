const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    product: {
        type: mongoose.ObjectId,
        ref: "Posts",
        required: true,
      },
      user: {
        type: mongoose.ObjectId,
        ref: "Users",
        required: true,
      },
      quantity:{
        type:Number,
        required:true
      }
})

module.exports = mongoose.model("Cart" , cartSchema);