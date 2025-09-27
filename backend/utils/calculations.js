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
    (acc, post) => {
      acc.likes += post.likes || 0;
      acc.comments += post.comments || 0;
      return acc;
    },
    { likes: 0, comments: 0 }
  );

  const totalLikes = totals.likes;
  const totalComments = totals.comments;

  const avgLikes = totalLikes / numberOfPosts;
  const avgComments = totalComments / numberOfPosts;
  const engagementRate = ((totalLikes + totalComments) / numberOfPosts / followers) * 100;

  return {
    avgLikes: parseFloat(avgLikes.toFixed(2)),
    avgComments: parseFloat(avgComments.toFixed(2)),
    engagementRate: parseFloat(engagementRate.toFixed(2)),
  };
};