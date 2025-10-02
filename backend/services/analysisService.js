import { ClarifaiStub, grpc } from 'clarifai-nodejs-grpc';
import logger from '../utils/logger.js';

const stub = ClarifaiStub.grpc();

const getMetadata = () => {
  const metadata = new grpc.Metadata();
  metadata.set("authorization", `Key ${process.env.CLARIFAI_API_KEY}`);
  return metadata;
};

const defaultAnalysis = {
  tags: [],
  vibe: 'N/A',
  quality: {
    lighting: 'N/A',
    visualAppeal: 'N/A',
  },
  events: [],
};

const MODEL_ID = process.env.CLARIFAI_MODEL_ID || 'aaa03c23b3724a16a56b629203edc62c';
const MODEL_VERSION_ID = process.env.CLARIFAI_MODEL_VERSION_ID || 'aa7f35c01e0642fda5cf400f543e7c40';

const analyzeMediaWithClarifai = (imageUrl) => {
  return new Promise((resolve) => {
    const request = {
      user_app_id: {
        user_id: process.env.CLARIFAI_USER_ID,
        app_id: process.env.CLARIFAI_APP_ID,
      },
      model_id: MODEL_ID,
      version_id: MODEL_VERSION_ID,
      inputs: [
        {
          data: {
            image: {
              url: imageUrl,
            },
          },
        },
      ],
    };

    stub.PostModelOutputs(request, getMetadata(), (err, response) => {
      if (err) {
        logger.error(`Clarifai API error: ${err.message}`, { err });
        resolve(null);
        return;
      }

      const status = response?.status;
      if (!status || status.code !== 10000) {
        logger.error(
          `Clarifai request failed: code=${status?.code} desc=${status?.description}`,
          { status }
        );
        resolve(null);
        return;
      }

      try {
        const output = response.outputs[0];
        const concepts = output.data.concepts || [];
        const tags = concepts.slice(0, 5).map(conc => conc.name);
        const vibe = tags.length > 0
          ? tags[0].charAt(0).toUpperCase() + tags[0].slice(1)
          : 'N/A';
        resolve({ tags, vibe });
      } catch (parseError) {
        logger.error(`Failed to parse Clarifai response: ${parseError.message}`, { parseError, response });
        resolve(null);
      }
    });
  });
};

export const analyzeImage = async (imageUrl) => {
  const result = await analyzeMediaWithClarifai(imageUrl);
  if (!result) {
    return defaultAnalysis;
  }
  return {
    ...defaultAnalysis,
    tags: result.tags,
    vibe: result.vibe,
    quality: {
      lighting: 'Good',
      visualAppeal: 'High',
    },
  };
};

export const analyzeVideo = async (thumbnailUrl) => {
  const result = await analyzeMediaWithClarifai(thumbnailUrl);
  if (!result) {
    return defaultAnalysis;
  }
  return {
    ...defaultAnalysis,
    events: result.tags.slice(0, 2),
    vibe: result.vibe,
    tags: result.tags,
  };
};
