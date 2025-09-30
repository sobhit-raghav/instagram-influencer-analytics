import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    influencer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Influencer',
      required: true,
    },
    shortcode: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: '',
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
    postedAt: {
      type: Date,
      required: true,
    },
    analysis: {
      tags: {
        type: [String],
        default: [],
      },
      vibe: {
        type: String,
        default: 'N/A',
      },
      quality: {
        lighting: { type: String, default: 'N/A' },
        visualAppeal: { type: String, default: 'N/A' },
        consistency: { type: String, default: 'N/A' },
      },
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;