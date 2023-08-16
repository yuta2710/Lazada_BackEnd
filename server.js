const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const colors = require("colors");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const errorHandler = require("./middleware/error.middleware");
const connectDB = require("./configs/db.config");

const app = express();

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

dotenv.config();

connectDB();

const users = require("./modules/user/user.route");
const auth = require("./modules/auth/auth.route");
const category = require("./modules/category/category.route");

app.use(cors());

app.use(`/api/${process.env.API_VERSION_1}/users`, users);
app.use(`/api/${process.env.API_VERSION_1}/auth`, auth);
app.use(`/api/${process.env.API_VERSION_1}/category`, category);

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
