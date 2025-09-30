import mongoose from 'mongoose';

const reelSchema = new mongoose.Schema(
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
    thumbnailUrl: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: '',
    },
    viewsCount: {
      type: Number,
      default: 0,
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
      events: {
        type: [String],
        default: [],
      },
      vibe: {
        type: String,
        default: 'N/A',
      },
      tags: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

const Reel = mongoose.model('Reel', reelSchema);

export default Reel;