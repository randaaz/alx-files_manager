import redis from 'redis';
import { promisify } from 'util';

/**
 * Class representing a Redis client.
 */
class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.getAsync = promisify(this.client.get).bind(this.client);

    this.client.on('error', (error) => {
      console.log(`Redis client not connected to the server: ${error.message}`);
    });

    this.client.on('connect', () => {
      // console.log('Redis client connected to the server');
    });
  }

  /**
   * Creates a new RedisClient instance.
   * Initializes the Redis client and sets up connection event handlers.
   */
  isAlive() {
    return this.client.connected;
  }

  /**
   * Checks if the Redis client is connected to the server.
   * @key {string} key to search for in redi.
   * @return {string} True if connected, otherwise false.
   */
  async get(key) {
    const value = await this.getAsync(key);
    return value;
  }

  /**
   * Retrieves the value associated with the specified key from Redis.
   * @key {string} The key to retrieve.
   * @value {string} value to be asigned to key.
   * @duration {number} TTL of key.
   * @return {undefined}  A promise that resolves to the value.
   */
  async set(key, value, duration) {
    this.client.setex(key, duration, value);
  }

  /**
   * Deletes the specified key from Redis.
   * @key {string} The key to delete.
   * @return {undefined}  No return
   */
  async del(key) {
    this.client.del(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
