const getRandomSubset = (arr, count) => {
  const shuffled = arr.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const MOCK_TAGS = [
  'travel', 'food', 'fashion', 'selfie', 'nature', 'cityscape', 'art', 
  'fitness', 'pet', 'product', 'lifestyle', 'architecture', 'beauty', 'DIY'
];

const MOCK_VIBES = [
  'Casual', 'Aesthetic', 'Luxury', 'Energetic', 'Minimalist', 'Vintage', 
  'Cozy', 'Professional', 'Adventurous', 'Calm'
];

const MOCK_QUALITY = {
  lighting: ['Bright & Airy', 'Moody', 'Golden Hour', 'Natural Light', 'Studio Lit'],
  visualAppeal: ['High', 'Excellent', 'Good', 'Stunning'],
  consistency: ['Consistent with Feed', 'Unique Style', 'Standard Look']
};

const MOCK_VIDEO_EVENTS = [
  'Person Dancing', 'Beach Scenery', 'Car Driving', 'Food Review', 'Unboxing',
  'Tutorial', 'Event Coverage', 'Comedy Skit', 'Workout Routine'
];

export const analyzeImage = async (imageUrl) => {
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 100));

  console.log(`Analyzing Image: ${imageUrl}`);

  const analysisResult = {
    tags: getRandomSubset(MOCK_TAGS, Math.floor(Math.random() * 4) + 2),
    vibe: getRandomItem(MOCK_VIBES),
    quality: {
      lighting: getRandomItem(MOCK_QUALITY.lighting),
      visualAppeal: getRandomItem(MOCK_QUALITY.visualAppeal),
      consistency: getRandomItem(MOCK_QUALITY.consistency),
    },
  };

  return analysisResult;
};

export const analyzeVideo = async (videoUrl) => {
  await new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 200));

  console.log(`Analyzing Video: ${videoUrl}`);

  const analysisResult = {
    events: getRandomSubset(MOCK_VIDEO_EVENTS, Math.floor(Math.random() * 3) + 1),
    vibe: getRandomItem(MOCK_VIBES),
    tags: getRandomSubset(MOCK_TAGS, Math.floor(Math.random() * 3) + 2),
  };

  return analysisResult;
};