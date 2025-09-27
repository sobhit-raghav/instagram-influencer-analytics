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
    likes: {
      type: Number,
      required: true,
      default: 0,
    },
    comments: {
      type: Number,
      required: true,
      default: 0,
    },
    postedAt: {
      type: Date,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    vibe: {
      type: String,
      trim: true,
      default: 'N/A',
    },
    quality: {
      lighting: { type: String, default: 'N/A' },
      visualAppeal: { type: String, default: 'N/A' },
      composition: { type: String, default: 'N/A' },
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;