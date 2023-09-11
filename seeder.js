const fs = require("fs");
const dotenv = require("dotenv");
const connectDB = require("./configs/db.config");

dotenv.config();

const User = require("./modules/user/user.model");
const Product = require("./modules/product/product.model");
const Category = require("./modules/category/category.model");
const Cart = require("./modules/cart/cart.model");
const Order = require("./modules/order/order.model");

// Connected to MongoDB
connectDB();

const deserializedUser = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8")
);

const deserializedProduct = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/products.json`, "utf-8")
);

const deserializedCategory = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/categories.json`, "utf-8")
);

const deserializedCart = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/carts.json`, "utf-8")
);

const deserializedOrder = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/orders.json`, "utf-8")
);

const loadingLogger = () => {
  console.log("Loading.......");
};

const insertData = async () => {
  try {
    await User.create(deserializedUser);
    await Product.create(deserializedProduct);
    await Category.create(deserializedCategory);
    await Cart.create(deserializedCart);
    await Order.create(deserializedOrder);
    ~loadingLogger();
    console.log(`Inserted Data: <Successfully>`);

    process.exit();
  } catch (error) {
    console.error(error);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();
    loadingLogger();
    console.log(`Deleted Data: <Successfully>`);
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === "-i") {
  insertData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
