const express =require('express')
const { isAuth } = require('../utills/auth')
const { addAddress, getAddress } = require('../controllers/shippingController')

const router = express.Router()

// add Address
router.post('/addAddress' , isAuth , addAddress)

// get Address
router.get('/getAddress' ,isAuth , getAddress)

module.exports = router