import {repository} from '@loopback/repository';
import {HttpErrors, Request} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {ServiceKey as keys} from '../keys/keys-service';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {EncryptDecrypt} from './encrypt-decrypt.service';
const jwt = require("jsonwebtoken");

export class AuthService {

  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository
  ) { }

  async Identify(userName: string, password: string): Promise<User | false> {
    let user = await this.userRepository.findOne({where: {userName: userName}});
    if (user) {
      let cryptPass = new EncryptDecrypt().Encrypt(password);
      if (user.password == cryptPass) {
        return user;
      }
    }

    return false;
  }

  async GenerateToken(user: User) {
    user.password = "";
    let token = jwt.sign({
      exp: keys.TOKEN_EXPIRATIONS_TIMES,
      data: {
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        role: user.role
      }
    }, keys.JWT_SECRET_KEYS);

    return token;
  }

  async VerifyUserToken(token: string) {

    let userProfile: UserProfile;

    try {
      let data = jwt.verify(token, keys.JWT_SECRET_KEYS).data;
      if (data.role == 1) {
        userProfile = Object.assign(
          {[securityId]: '', name: ''},
          {
            [securityId]: data.id,
            name: data.name,
            id: data.id,
          },
        );
        return userProfile;
      } else {
        throw new HttpErrors.Unauthorized(`User Authorization require.`);
      }
    } catch (err) {
      throw new HttpErrors.Unauthorized(`User verification token.`);
    }
  }

  async VerifyAdminToken(token: string) {

    let userProfile: UserProfile;

    try {
      let data = jwt.verify(token, keys.JWT_SECRET_KEYS).data;
      if (data.role == 2) {
        userProfile = Object.assign(
          {[securityId]: '', name: ''},
          {
            [securityId]: data.id,
            name: data.name,
            id: data.id,
          },
        );
        return userProfile;
      } else {
        throw new HttpErrors.Unauthorized(`Admin Authorization require.`);
      }
    } catch (err) {
      throw new HttpErrors.Unauthorized(`Admin verification token.`);
    }
  }

  async extractCredentials(request: Request) {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized(`Authorization header not found.`);
    }

    // for example : Bearer xxx.yyy.zzz
    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized(
        `Authorization header is not of type 'Bearer'.`,
      );
    }

    //split the string into 2 parts : 'Bearer ' and the `xxx.yyy.zzz`
    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2)
      throw new HttpErrors.Unauthorized(
        `Authorization header value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.`,
      );
    const token = parts[1];

    return token;
  }


}
