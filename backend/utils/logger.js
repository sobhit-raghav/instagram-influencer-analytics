const debugMode = process.env.DEBUG === 'true';

const logger = {
  debug: (message, ...args) => {
    if (debugMode) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },
  error: (message, ...args) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  info: (message, ...args) => {
    console.log(`[INFO] ${message}`, ...args);
  }
};

export default logger;