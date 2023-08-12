const jwt = require("jsonwebtoken");

export const authTokenResponse = async(user) => {
    return jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })
}

export const verifyToken = async(token) => {
    return new Promise((resolve, reject) => {
        jwt.verifyToken(token, process.env.JWT_SECRET, (err, payload) => {
            if(err) reject(err)
            
            resolve(payload);
        })
    })
}