const TAG_KEYWORDS = {
  outdoor: ['outdoor', 'nature', 'beach', 'mountain', 'hike'],
  nightlife: ['nightlife', 'party', 'club', 'concert', 'bar'],
  'food review': ['review', 'restaurant', 'tasting', 'foodie'],
  comedy: ['funny', 'comedy', 'sketch', 'lol', 'joke'],
  dance: ['dance', 'choreography', 'dancing'],
};

const VIBE_KEYWORDS = {
  'Party': ['party', 'fun', 'celebration', 'nightlife'],
  'Travel Luxury': ['luxury', 'travel', 'vacation', 'exclusive', 'yacht'],
  'Casual Daily Life': ['daily', 'vlog', 'casual', 'routine', 'home'],
  'Inspirational': ['motivation', 'inspirational', 'success', 'grind'],
};

const EVENT_OBJECT_KEYWORDS = {
  'person dancing': ['dance', 'dancing', 'choreography'],
  'beach': ['beach', 'ocean', 'sand', 'waves'],
  'car': ['car', 'vehicle', 'driving', 'auto'],
  'concert': ['concert', 'live music', 'festival'],
};

export const analyzeVideo = async (caption = '') => {
  const lowerCaseCaption = caption.toLowerCase();
  const results = {
    tags: new Set(),
    vibe: 'N/A',
    eventsOrObjects: new Set(),
  };

  for (const tag in TAG_KEYWORDS) {
    if (TAG_KEYWORDS[tag].some(keyword => lowerCaseCaption.includes(keyword))) {
      results.tags.add(tag);
    }
  }

  for (const vibe in VIBE_KEYWORDS) {
    if (VIBE_KEYWORDS[vibe].some(keyword => lowerCaseCaption.includes(keyword))) {
      results.vibe = vibe;
      break;
    }
  }
  if (results.vibe === 'N/A') results.vibe = 'Casual Daily Life';

  for (const event in EVENT_OBJECT_KEYWORDS) {
    if (EVENT_OBJECT_KEYWORDS[event].some(keyword => lowerCaseCaption.includes(keyword))) {
      results.eventsOrObjects.add(event);
    }
  }

  results.tags = [...results.tags];
  results.eventsOrObjects = [...results.eventsOrObjects];

  await new Promise(resolve => setTimeout(resolve, 100));
  return results;
};