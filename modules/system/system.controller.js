const { initMongoId } = require("../../utils/init.util");

exports.initServerID = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: initMongoId(req.params.limit),
  });
};
