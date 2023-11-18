const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    ratings: {
      type: String,
      default: 0
    },
    images: [
      {
        image: {
          type: String,
          required: true
        }
      }
    ],
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },
    user: {
      type: mongoose.ObjectId,
      ref: "Users",
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },

    numOfReviews: {
      type: Number,
      default: 0
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        rating: {
          type: String,
          required: true
        },
        comment: {
          type: String,
          required: true
        }
      }
    ],

  },
  { timestamps: true }
);


module.exports = mongoose.model("Posts", postSchema);