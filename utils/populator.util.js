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
    category: [
      {
        path: "products",
        model: "Product", // Replace "Product" with the actual model name for products
      },
      {
        path: "childCat",
        model: "Category", // Replace "Category" with the actual model name for child categories
        populate: {
          path: "products",
          model: "Product", // Replace "Product" with the actual model name for products within child categories
        },
      },
    ],
    cart: ["customer", "products", "products.product"],
  },
};
