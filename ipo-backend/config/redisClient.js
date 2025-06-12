const { createClient } = require("redis");
require("dotenv").config();

let redisClient;
let isRedisConnected = false;

const initializeRedisClient = async () => {
  const redisURI = process.env.REDIS_URI;
  if (!redisURI) {
    console.warn("REDIS_URI not found in .env, Redis caching will be disabled.");
    return;
  }

  redisClient = createClient({
    url: redisURI,
  });

  redisClient.on("error", (error) => {
    console.error(`Redis Client Error: ${error}`);
    isRedisConnected = false;
  });

  redisClient.on("connect", () => {
    console.log("Connected to Redis...");
    isRedisConnected = true;
  });

  redisClient.on("end", () => {
    console.log("Redis client connection closed.");
    isRedisConnected = false;
  });

  try {
    await redisClient.connect();
  } catch (error) {
    console.error(`Failed to connect to Redis: ${error}`);
  }
};

// Utility function to safely check Redis connection status
const getRedisStatus = () => isRedisConnected;

// Cache helper functions
const getFromCache = async (key) => {
  if (!isRedisConnected || !redisClient) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error getting from Redis cache: ${error}`);
    return null;
  }
};

const setInCache = async (key, data, ttlSeconds = 3600) => {
  if (!isRedisConnected || !redisClient) return;
  try {
    await redisClient.setEx(key, ttlSeconds, JSON.stringify(data));
  } catch (error) {
    console.error(`Error setting in Redis cache: ${error}`);
  }
};

const deleteFromCache = async (key) => {
  if (!isRedisConnected || !redisClient) return;
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error(`Error deleting from Redis cache: ${error}`);
  }
};

module.exports = {
  redisClient,
  initializeRedisClient,
  getRedisStatus,
  getFromCache,
  setInCache,
  deleteFromCache,
};
