const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const localStorage = require('localStorage')// Register Controller
const ErrorHandler = require('../utills/errorHandler')
const catchAsyncError = require('../middlewares/catchAsyncError')
const sendToken = require('../utills/jwt')
const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        let avatar;

        if (req.file) {
            avatar = `${process.env.BACKEND_URL}/uploads/user/${req.file.originalname}`
        }



        // Vallidations
        if (!username) {
            return res.send({ error: "Name is Required" });
        }
        if (!email) {
            return res.send({ error: "E-Mail is Required" });
        }

        if (!password) {
            return res.send({ error: "Password is Required" });
        }

        // Check Extisting User

        const extistingUser = await userModel.findOne({ email })

        if (extistingUser) {
            return res.status(200).send({
                success: false,
                message: "User Already Exists"
            })
        }

        // if user not exists to register and save DB
        // To hash the password

        const hassedPassword = await bcrypt.hash(password, 10)

        const user = await new userModel({
            username,
            email,
            password: hassedPassword,
            avatar
        }).save()


        res.status(201).send({
            success: true,
            message: "user registered successfully",
            user
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error
        })
    }
}


// Login Controller
const login = catchAsyncError(async (req, res, next) => {
    try {
        const { email, password } = req.body

        // vallidation
        if (!email || !password) {
            return next(new ErrorHandler('Please enter email & password', 400))
        }

        // Check User
        const user = await userModel.findOne({ email })

        if (!user) {
            // If user is Not register
            return next(new ErrorHandler('Invalid email or password', 401))
        } else {
            // Password Comparission
            const comparePass = await bcrypt.compare(password, user.password)

            // If Password is Error
            if (!comparePass) {
                return next(new ErrorHandler('Invalid email or password', 401))
            }

            sendToken(user, 201, res)

          
        } 
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error
        })
    }
})

// get All User
const getAllUser = async (req, res) => {
    try {
        const user = await userModel.find({ _id: { $ne: req.user._id } })
        if (user) {
            res.status(200).send({
                success: true,
                message: "User get Successfully",
                user
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Internal Server Error"
        })
    }
}

// get single user
const singelUser = catchAsyncError(async (req, res, next) => {
    try {
        const user = req.user
        if (user) {
            res.status(200).send({ user, success: true});
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "User Not Found",
        });
    }
})

//Logout 
const logoutUser = (req, res, next) => {
  
    localStorage.setItem("token", null)

    res.status(200)
    .json({
        success: true,
        message: "Loggedout"
    })

}




// Forget Password
const forgotPassword = async (req, res) => {

}

module.exports = { register, login, singelUser, forgotPassword, getAllUser ,logoutUser }