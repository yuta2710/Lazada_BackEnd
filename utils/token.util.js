const jwt = require("jsonwebtoken");

exports.createToken = (user) => {
    return jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })
}

exports.verifyToken = async (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if(err) reject(err);

            resolve(payload);
        })
    })
} 