const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },

  filename: function (req, file, cb) {
    const productId = req.params.productId;
    const fileName = `photo_${productId}${path.extname(file.originalname)}`;

    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
