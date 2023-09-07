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

exports.cartPopulatePath = [
  "customer",
  "products",
  "products.product",
  "products.seller",
];

exports.populateConfigurations = {
  path: {
    product: [
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
    cart: ["customer", "products", "products.product", "products.seller"],
  },
};
