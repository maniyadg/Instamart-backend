const jwt = require('jsonwebtoken');
const localStorage = require('localStorage');

exports.isAuth = async (req, res, next) => {
    const  token  = localStorage.getItem("token")
    console.log(token)
    if(token){
        let data = await jwt.verify(token, process.env.SECRET_KEY);
        console.log(data)
        req.user = data.user
        if(!req.user){
            return res.status(401).send({message: 'Not authorized.'})
        }

        return next();
    }

    return res.status(401).send({message: 'Not authorized'})
}