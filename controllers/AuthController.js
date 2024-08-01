import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import redisClient from '../utils/redis';
import userUtils from '../utils/user';

class AuthController {
  /**
   * Controller for handling user authentication
   *
   * (Base64 of the <email>:<password>), fid te ur asiat
   * and th this paord (reminder: we are storing the SHA1 of the password)
   * If no user has n found,urn an error 401
   * Othe:
   * Gete a om stg (using uuidv4) as ten
   * Cate a ky: auth_<token>
   * Ue t key for sng in is (by using the redisClient create previously)
   * the ur ID r 24 hs
   * Ren tis toke: { "token": "155342df-2399-41da-9e8c-458b6ac52a0c" }
   * wi a stas de 200
   */
  static async getConnect(request, response) {
    const Authorization = request.header('Authorization') || '';

    const credentials = Authorization.split(' ')[1];

    if (!credentials) { return response.status(401).send({ error: 'Unauthorized' }); }

    const decodedCredentials = Buffer.from(credentials, 'base64').toString(
      'utf-8',
    );

    const [email, password] = decodedCredentials.split(':');

    if (!email || !password) { return response.status(401).send({ error: 'Unauthorized' }); }

    const sha1Password = sha1(password);

    const user = await userUtils.getUser({
      email,
      password: sha1Password,
    });

    if (!user) return response.status(401).send({ error: 'Unauthorized' });

    const token = uuidv4();
    const key = `auth_${token}`;
    const hoursForExpiration = 24;

    await redisClient.set(key, user._id.toString(), hoursForExpiration * 3600);

    return response.status(200).send({ token });
  }

  /**
   * Handles user login and generates an authentication
   *
   * The request object.
   * The response object
   * The response object containing the authentication token
   */
  static async getDisconnect(request, response) {
    const { userId, key } = await userUtils.getUserIdAndKey(request);

    if (!userId) return response.status(401).send({ error: 'Unauthorized' });

    await redisClient.del(key);

    return response.status(204).send();
  }
}

export default AuthController;
