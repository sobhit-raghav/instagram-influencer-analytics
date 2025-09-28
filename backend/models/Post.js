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
    }
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);

export default Post;