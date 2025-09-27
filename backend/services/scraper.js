const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

export const scrapeInstagramProfile = async (username) => {
  console.log(`[Mock Scraper] Faking scrape for username: ${username}`);

  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    profile: {
      name: 'MrBeast',
      username: 'mrbeast',
      profilePicUrl: 'https://placehold.co/150x150/1a1a1a/ffffff?text=MB',
      bio: 'I want to make the world a better place. Creator of the Year.',
      followers: 257000000,
      following: 300,
      postsCount: 250,
    },

    posts: Array.from({ length: 10 }, (_, i) => ({
      shortcode: `C${Math.random().toString(36).substring(2, 12)}`,
      imageUrl: `https://placehold.co/1080x1080/2d2d2d/ffffff?text=Post+${i + 1}`,
      caption: `This is the caption for my amazing post #${i + 1}! #adventure #makingadifference`,
      likes: random(5000000, 15000000),
      comments: random(50000, 150000),
      postedAt: daysAgo(i * 3 + 2),
    })),

    reels: Array.from({ length: 5 }, (_, i) => ({
      shortcode: `R${Math.random().toString(36).substring(2, 12)}`,
      thumbnailUrl: `https://placehold.co/1080x1920/1a1a1a/ffffff?text=Reel+${i + 1}`,
      caption: `Check out this incredible reel #${i + 1}! So much fun.`,
      views: random(20000000, 80000000),
      likes: random(2000000, 8000000),
      comments: random(20000, 80000),
      postedAt: daysAgo(i * 7 + 1),
    })),
  };
};