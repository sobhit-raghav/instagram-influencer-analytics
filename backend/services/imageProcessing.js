const TAG_KEYWORDS = {
  travel: ['travel', 'vacation', 'explore', 'beach', 'mountains', 'city', 'abroad'],
  food: ['food', 'restaurant', 'eat', 'delicious', 'foodie', 'recipe', 'tasty'],
  fashion: ['fashion', 'ootd', 'style', 'outfit', 'clothing', 'shopping'],
  fitness: ['fitness', 'gym', 'workout', 'health', 'run', 'exercise'],
  tech: ['tech', 'gadget', 'code', 'developer', 'software', 'setup'],
};

const VIBE_KEYWORDS = {
  Luxury: ['luxury', 'lavish', 'yacht', 'mansion', 'exclusive', 'rich'],
  Aesthetic: ['aesthetic', 'art', 'design', 'minimal', 'vsco', 'moody'],
  Energetic: ['energetic', 'party', 'fun', 'dance', 'excited', 'loud'],
  Casual: ['casual', 'daily', 'relax', 'chill', 'home', 'everyday'],
  Professional: ['business', 'work', 'office', 'career', 'meeting'],
};

const QUALITY_OPTIONS = {
  lighting: ['Good', 'Excellent', 'Studio', 'Natural', 'Dim'],
  visualAppeal: ['High', 'Very High', 'Stunning', 'Standard'],
  composition: ['Balanced', 'Rule of Thirds', 'Centered', 'Dynamic'],
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const analyzeImage = async (caption = '') => {
  const lowerCaseCaption = caption.toLowerCase();
  const results = {
    tags: new Set(),
    vibe: 'N/A',
    quality: {
      lighting: getRandom(QUALITY_OPTIONS.lighting),
      visualAppeal: getRandom(QUALITY_OPTIONS.visualAppeal),
      composition: getRandom(QUALITY_OPTIONS.composition),
    },
  };

  for (const tag in TAG_KEYWORDS) {
    if (TAG_KEYWORDS[tag].some(keyword => lowerCaseCaption.includes(keyword))) {
      results.tags.add(tag);
    }
  }

  const hashtags = lowerCaseCaption.match(/#\w+/g) || [];
  hashtags.forEach(tag => results.tags.add(tag.replace('#', '')));

  for (const vibe in VIBE_KEYWORDS) {
    if (VIBE_KEYWORDS[vibe].some(keyword => lowerCaseCaption.includes(keyword))) {
      results.vibe = vibe;
      break;
    }
  }
  if (results.vibe === 'N/A') {
    results.vibe = 'Casual';
  }

  results.tags = [...results.tags];

  await new Promise(resolve => setTimeout(resolve, 100));

  return results;
};