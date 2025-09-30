import mongoose from 'mongoose';

const influencerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    profilePicUrl: {
      type: String,
      required: false,
      default: '',
    },
    bio: {
      type: String,
      required: false,
      default: '',
    },
    followers: {
      type: Number,
      required: true,
      default: 0,
    },
    following: {
      type: Number,
      required: true,
      default: 0,
    },
    postsCount: {
      type: Number,
      required: true,
      default: 0,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    averageLikes: {
      type: Number,
      default: 0,
    },
    averageComments: {
      type: Number,
      default: 0,
    },
    engagementRate: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Influencer = mongoose.model('Influencer', influencerSchema);

export default Influencer;