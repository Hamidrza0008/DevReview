function calculateAverageRating(reviews) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return 0;
  }
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return Number((total / reviews.length).toFixed(1));
}

function getReviewStats(reviews) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return { reviewsCount: 0, averageRating: 0 };
  }
  const reviewsCount = reviews.length;
  const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
  return {
    reviewsCount,
    averageRating: Number((totalRating / reviewsCount).toFixed(1)),
  };
}

module.exports = { calculateAverageRating, getReviewStats };
