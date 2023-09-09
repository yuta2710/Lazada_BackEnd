exports.populateConfigurations = {
  path: {
    product: [
      "seller",
      "category",
      // {
      //   path: "category",
      //   populate: {
      //     path: "parentCat",
      //   },
      // },
      // {
      //   path: "category",
      //   populate: {
      //     path: "childCat",
      //   },
      // },
      // {
      //   path: "category",
      //   populate: {
      //     path: "products",
      //   },
      // },
    ],
    category: ["childCat", "products"],
    cart: ["products", "products.product", "products.seller"],
  },
};
