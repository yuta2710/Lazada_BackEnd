const { default: mongoose } = require("mongoose");

exports.initMongoId = (limit) => {
  const ids = [];

  for (let i = 0; i < limit; i++) {
    const mongoId = new mongoose.Types.ObjectId();
    ids.push(mongoId);
  }

  // Perform multiple rounds of shuffling and swapping
  const rounds = Math.floor(limit / 2);

  for (let round = 0; round < rounds; round++) {
    // Shuffle the array randomly
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }

    // Swap random elements within the array
    const i = Math.floor(Math.random() * limit);
    const j = Math.floor(Math.random() * limit);
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }

  return ids;
};
