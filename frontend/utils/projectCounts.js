export const getProjectLikesCount = (project) =>
  project?.likesCount ?? (Array.isArray(project?.likes) ? project.likes.length : 0);

export const getProjectReviewsCount = (project) =>
  project?.reviewsCount ?? (Array.isArray(project?.reviews) ? project.reviews.length : 0);
