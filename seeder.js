const fs = require("fs");
const colors = require("colors");
const dotenv = require("dotenv");
const connectDB = require("./configs/db.config");

dotenv.config();

const User = require("./modules/user/user.model");

// Connected to MongoDB
connectDB();

const deserializedUser = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8"));
const loadingLogger = () => {
    console.log("Loading.......".magenta.bold);
};

const insertData = async() => {
    try {
        await User.create(deserializedUser);
        loadingLogger();
        console.log(`Inserted Data: `.green.underline + `<Successfully>`.green.inverse);

        process.exit();
    } catch (error) {
        console.error(error);
    }
}

const deleteData = async() => {
    try {
        await User.deleteMany();
        loadingLogger();
        console.log(
            `Deleted Data: `.red.underline + `<Successfully>`.red.inverse
        );
        process.exit();
    } catch (error) {
        console.error(error);
    }
}

if(process.argv[2] === "-i") {
    insertData();
}else if(process.argv[2] === "-d") {
    deleteData();
}