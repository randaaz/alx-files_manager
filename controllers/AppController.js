import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
  /**
   * Controller for application status and statistics
   * by using the 2 utils created previously:
   * { "redis": true, "db": true } with a status code 200
   */
  static getStatus(request, response) {
    const status = {
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    };
    response.status(200).send(status);
  }

  /**
   * Handles the request to get files in DB:
   * { "users": 12, "files": 1231 } The reque
   *  The response object
   */
  static async getStats(request, response) {
    const stats = {
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    };
    response.status(200).send(stats);
  }
}

export default AppController;
