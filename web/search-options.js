export const searchOptions = {
  fields: ['title', 'headings', 'text'],
  storeFields: ['title', 'summary', 'url', 'section', 'status', 'needsReview'],
  searchOptions: { boost: { title: 5, headings: 2 }, prefix: true, fuzzy: 0.15, combineWith: 'AND' },
};
