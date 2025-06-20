class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  // 🔍 Search by keyword in title, description, or pincode (using regex)
  search() {
    if (this.queryStr.keyword) {
      const keyword = this.queryStr.keyword.trim();
      this.query = this.query.find({
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
          { pincode: { $regex: keyword, $options: 'i' } }
        ]
      });
    }
    return this;
  }

  // 🧪 Filtering for numeric/date fields
  filter() {
    const queryCopy = { ...this.queryStr };

    // Remove fields not used for filtering
    ['keyword', 'limit', 'page'].forEach((field) => delete queryCopy[field]);

    const filterQuery = {};

    Object.keys(queryCopy).forEach((key) => {
      if (key.includes('[')) {
        const [field, op] = key.split('[');
        const operator = op.replace(']', '');

        const isDateField = field === 'createdAt';
        const rawValue = queryCopy[key];

        let value;
        if (isDateField) {
          value = !isNaN(Date.parse(rawValue)) ? new Date(rawValue) : null;
        } else if (!isNaN(rawValue)) {
          value = Number(rawValue);
        } else {
          value = rawValue;
        }

        if (value !== null && value !== undefined && value !== '') {
          filterQuery[field] = {
            ...filterQuery[field],
            [`$${operator}`]: value
          };
        }
      } else {
        // ✅ Direct match
        filterQuery[key] = queryCopy[key];
      }
    });

    console.log("Parsed filter:", filterQuery);
    this.query = this.query.find(filterQuery);
    return this;
  }

  // 📄 Pagination
  paginate(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
