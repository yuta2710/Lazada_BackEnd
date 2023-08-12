const mongoose = require("mongoose");

const connectDB =  async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold);
    } catch (error) {
        throw new Error(`Unconnected MongoDB: Something went wrong`.red.underline.bold);
    }
}

module.exports = connectDB;