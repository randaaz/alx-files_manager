import redisClient from './redis';
import dbClient from './db';

/**
 * Utility functions for user-related operations.
 */
const userUtils = {
  /**
   * Gets a user id and key of redis from request
   * @request {request_object} express request obj
   * @return {object} object containing userId and
   * redis key for token
   */
  async getUserIdAndKey(request) {
    const obj = { userId: null, key: null };

    const xToken = request.header('X-Token');

    if (!xToken) return obj;

    obj.key = `auth_${xToken}`;

    obj.userId = await redisClient.get(obj.key);

    return obj;
  },

  /**
   * Retrieves a user document from the database based on the provided query.
   * @query {object} MongoDB query object to find the user.
   * @return {object} The user document if found, or null if not found.
   */
  async getUser(query) {
    const user = await dbClient.usersCollection.findOne(query);
    return user;
  },
};

export default userUtils;
