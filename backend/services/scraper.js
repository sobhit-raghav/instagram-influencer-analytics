import axios from 'axios';
import { ApiError } from '../middlewares/errorHandler.js';
import logger from '../utils/logger.js';

const calculateEngagement = (posts, followerCount) => {
  if (!posts || posts.length === 0 || followerCount === 0) {
    return {
      averageLikes: 0,
      averageComments: 0,
      engagementRate: 0,
    };
  }

  const totalLikes = posts.reduce((sum, post) => sum + post.likesCount, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.commentsCount, 0);
  const postCount = posts.length;

  const averageLikes = totalLikes / postCount;
  const averageComments = totalComments / postCount;

  const engagementRate = ((averageLikes + averageComments) / followerCount) * 100;

  return {
    averageLikes: Math.round(averageLikes),
    averageComments: Math.round(averageComments),
    engagementRate: parseFloat(engagementRate.toFixed(2)),
  };
};

export const scrapeInstagramProfile = async (username) => {
  const url = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
  
  try {
    const { data: json } = await axios.get(url, {
      headers: {
        'User-Agent': 'Instagram 76.0.0.15.395 Android (24/7.0; 640dpi; 1440x2560; samsung; SM-G930F; herolte; samsungexynos8890; en_US; 138226743)',
        'X-IG-App-ID': '936619743392459',
      },
    });

    if (!json.data || !json.data.user) {
      throw new ApiError(`Profile for '${username}' not found or API structure changed.`, 404);
    }

    const userData = json.data.user;
    const mediaNodes = userData.edge_owner_to_timeline_media.edges || [];

    const posts = [];
    const reels = [];

    for (const nodeWrapper of mediaNodes) {
      const node = nodeWrapper.node;

      const commonData = {
        shortcode: node.shortcode,
        caption: node.edge_media_to_caption.edges[0]?.node.text || '',
        likesCount: node.edge_media_preview_like.count,
        commentsCount: node.edge_media_to_comment.count,
        postedAt: new Date(node.taken_at_timestamp * 1000),
      };

      if (node.is_video) {
        reels.push({
          ...commonData,
          thumbnailUrl: node.display_url,
          videoUrl: node.video_url,
          viewsCount: node.video_view_count,
        });
      } else {
        posts.push({
          ...commonData,
          imageUrl: node.display_url,
        });
      }
    }

    const engagement = calculateEngagement(posts, userData.edge_followed_by.count);

    const profile = {
      username: userData.username,
      name: userData.full_name,
      profilePicUrl: userData.profile_pic_url_hd,
      bio: userData.biography,
      followers: userData.edge_followed_by.count,
      following: userData.edge_follow.count,
      postsCount: userData.edge_owner_to_timeline_media.count,
      isPrivate: userData.is_private,
      isVerified: userData.is_verified,
      ...engagement,
    };

    logger.info(`Successfully scraped ${posts.length} posts and ${reels.length} reels for ${username}.`);

    return { 
      profile, 
      posts: posts.slice(0, 10),
      reels: reels.slice(0, 5) 
    };

  } catch (error) {
    if (error.response && error.response.status === 404) {
      logger.error(`Scraper failed for ${username}: Profile not found (404).`);
      throw new ApiError(`Instagram profile for '${username}' not found.`, 404);
    }
    logger.error(`Scraper failure for ${username}: ${error.message}`);
    throw new ApiError(`Failed to scrape Instagram profile for ${username}. The account may be private or an internal error occurred.`, 500);
  }
};