const { default: mongoose } = require("mongoose");

exports.convertToMongoIdFormat = (strId) => {
  const newObjectId = mongoose.Types.ObjectId(strId);
  return newObjectId;
};
