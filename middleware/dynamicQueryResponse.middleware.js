const dynamicQueryResponse = (model, populate) => async (req, res, next) => {
  let query;
  const cloneQuery = { ...req.query };
  const removeFields = ["select", "sort", "page", "limit"];

  removeFields.forEach((field) => delete cloneQuery[field]);

  let queryStr = JSON.stringify(cloneQuery);

  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|int)\b/g,
    (match) => `$${match}`
  );

  // Searching the resources
  query = model.find(JSON.parse(queryStr));

  /**
   * @Field: Select
   */

  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  if (req.query.sort) {
    const by = req.query.sort.split(",").join(" ");
    query = query.sort(by);
  } else {
    query = query.sort("-createdAt");
  }

  /**
   * @Field: Pagination
   */
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10; // ten per page
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(startIndex).limit(limit);

  if (populate) {
    query = query.populate(populate);
  }

  // Executing query
  const retrievers = await query;
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.dynamicQueryResponse = {
    success: true,
    count: retrievers.length,
    pagination,
    data: retrievers,
  };

  next();
};

module.exports = dynamicQueryResponse;
