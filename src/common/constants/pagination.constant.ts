export const Pagination = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  skip: (page: number, limit: number) => (page - 1) * limit,
  totalPage: (total: number, limit: number) => Math.ceil(total / limit),
};
