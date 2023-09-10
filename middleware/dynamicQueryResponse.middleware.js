const dynamicQueryResponse =
  (model, ...populates) =>
  async (req, res, next) => {
    let query
    const cloneQuery = { ...req.query }
    const removeFields = ['select', 'sort', 'page', 'limit']

    removeFields.forEach(field => delete cloneQuery[field])

    let queryStr = JSON.stringify(cloneQuery)

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|int)\b/g,
      match => `$${match}`
    )

    // Searching the resources
    query = model.find(JSON.parse(queryStr))

    /**
     * @Field: Select
     */
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ')
      query = query.select(fields)
    }

    /**
     * @Field: Sort
     */
    if (req.query.sort) {
      const by = req.query.sort.split(',').join(' ')
      query = query.sort(by)
    } else {
      query = query.sort('-createdAt')
    }

    if (req.query.sort) {
    }

    /**
     * @Field: Page
     */
    const page = parseInt(req.query.page, 10) || 1
    /**
     * @Field: Limit
     */
    const limit = parseInt(req.query.limit, 10) || 10 // ten per page
    const startIndex = (page - 1) * limit

    // Execute the query without skip and limit to get the total count
    const total = await model.countDocuments(JSON.parse(queryStr))

    query = query.skip(startIndex).limit(limit)

    if (populates.length > 0) {
      for (let i = 0; i < populates.length; i++) {
        query = query.populate(populates[i])
      }
    }

    // Executing query
    const retrievers = await query

    // Pagination
    const pagination = {}

    // Set next page
    const endIndex = startIndex + limit
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      }
    }

    // Set previous page
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      }
    }

    pagination.numberOfPage = Math.ceil(total / limit)

    res.dynamicQueryResponse = {
      success: true,
      count: retrievers.length,
      pagination,
      data: retrievers
    }

    next()
  }

module.exports = dynamicQueryResponse
