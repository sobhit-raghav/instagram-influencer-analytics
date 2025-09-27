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
    caption: {
      type: String,
      default: '',
    },
    views: {
      type: Number,
      required: true,
      default: 0,
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
    eventsOrObjects: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Reel = mongoose.model('Reel', reelSchema);

export default Reel;