exports.productPopulatePath = [
  "seller",
  "category",
  {
    path: "category",
    populate: {
      path: "parentCat",
    },
  },
  {
    path: "category",
    populate: {
      path: "childCat",
    },
  },

  {
    path: "category",
    populate: {
      path: "products",
    },
  },
];

exports.categoryPopulatePath = ["childCat", "products"];

exports.populateConfigurations = {
  path: {
    products: [
      "seller",
      "category",
      {
        path: "category",
        populate: {
          path: "parentCat",
        },
      },
      {
        path: "category",
        populate: {
          path: "childCat",
        },
      },

      {
        path: "category",
        populate: {
          path: "products",
        },
      },
    ],
    category: ["childCat", "products"],
  },
};
