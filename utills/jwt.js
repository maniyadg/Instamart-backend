const jwt = require('jsonwebtoken')
const localStorage = require('localStorage')

const sendToken = (user, statusCode, res) => {

    // if Password is correct to generate Token
    const token = jwt.sign({ user }, process.env.secret_key, {
        expiresIn: "1d",

    })

    localStorage.setItem("token", token)

    res.cookie("token", token)

    res.status(statusCode).send({
        success: true,
        user,
        token
    })

}

module.exports = sendToken;