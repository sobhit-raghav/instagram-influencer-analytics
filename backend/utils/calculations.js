export const calculateEngagementMetrics = (posts, followers) => {
  if (!posts || posts.length === 0 || !followers || followers === 0) {
    return {
      avgLikes: 0,
      avgComments: 0,
      engagementRate: 0,
    };
  }

  const numberOfPosts = posts.length;

  const totals = posts.reduce(
    (accumulator, currentPost) => {
      accumulator.likes += currentPost.likes || 0;
      accumulator.comments += currentPost.comments || 0;
      return accumulator;
    },
    { likes: 0, comments: 0 }
  );

  const { likes: totalLikes, comments: totalComments } = totals;

  const avgLikes = totalLikes / numberOfPosts;
  const avgComments = totalComments / numberOfPosts;
  const engagementRate = ((totalLikes + totalComments) / numberOfPosts / followers) * 100;

  return {
    avgLikes: parseFloat(avgLikes.toFixed(2)),
    avgComments: parseFloat(avgComments.toFixed(2)),
    engagementRate: parseFloat(engagementRate.toFixed(2)),
  };
};