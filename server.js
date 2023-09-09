const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");

const errorHandler = require("./middleware/error.middleware");
const connectDB = require("./configs/db.config");

const app = express();

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Config security headers
app.use(helmet());

/**
 * Reduce the size of files being sent from the server to the user's browser,
 * Thereby improving page load speed and reducing network bandwidth usage
 */
app.use(compression());

dotenv.config();

connectDB();

const users = require("./modules/user/user.route");
const auth = require("./modules/auth/auth.route");
const category = require("./modules/category/category.route");
const product = require("./modules/product/product.route");
const cart = require("./modules/cart/cart.route");
const order = require("./modules/order/order.route");
const system = require("./modules/system/system.route");

app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

app.use(`/api/${process.env.API_VERSION_1}/users`, users);
app.use(`/api/${process.env.API_VERSION_1}/auth`, auth);
app.use(`/api/${process.env.API_VERSION_1}/categories`, category);
app.use(`/api/${process.env.API_VERSION_1}/carts`, cart);
app.use(`/api/${process.env.API_VERSION_1}/products`, product);
app.use(`/api/${process.env.API_VERSION_1}/orders`, order);
app.use(`/api/${process.env.API_VERSION_1}/system`, system);

// Serve static files from the 'public/uploads' directory
app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "public/uploads"))
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(errorHandler);

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(
    `Server connected to http://localhost:${PORT}`.magenta.underline.bold
  );
});

// Handle the unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);

  // Close server | Exit a process
  server.close(() => process.exit(1));
});
