import {repository} from '@loopback/repository';
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

}
