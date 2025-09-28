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
    }
  },
  {
    timestamps: true,
  }
);

const Reel = mongoose.model('Reel', reelSchema);

export default Reel;