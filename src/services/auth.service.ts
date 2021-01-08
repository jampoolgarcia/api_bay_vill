import {model, property, repository} from '@loopback/repository';
import {HttpErrors, Request} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {ServiceKey as keys} from '../keys/keys-service';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {EncryptDecrypt} from './encrypt-decrypt.service';
const jwt = require("jsonwebtoken");

/*
  representa un objeto del tipo UserChangePassword
  con los datos necesarios para el cambio de clave.
*/
@model()
export class UserChangePassword {
  @property()
  password: string;
  @property()
  newPassword: string;
  @property()
  user: User;
}

/*
 representa un objeto del tipo credencials que
 es necesario para el proceso de login.
*/
@model()
export class Credencials {
  @property()
  userName: string;
  @property()
  password: string;
}

/*
representa un objeto del tipo UserReset que
contiene lo necesario para realizar la recuperacion
de la clave
*/
@model()
export class UserReset {
  @property()
  userName: string;
  @property({
    type: 'array',
    itemType: 'number',
  })
  questions: number[];
  @property({
    type: 'array',
    itemType: 'string',
  })
  replies: string[];
  @property()
  password: string;
}

export class AuthService {

  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository
  ) { }

  /*
    Realiza el proceso de login, recibiendo un userName y una clave
    y retornando un usuario o false
  */
  async Identify(credencials: Credencials): Promise<User | false> {
    let user = await this.UserExist(credencials.userName);
    if (user != null) {
      let cryptPass = new EncryptDecrypt().Encrypt(credencials.password);
      if (user.password == cryptPass) {
        return user;
      }
    }

    return false;
  }

  /*
    Realiza el proceso de restablecimiento de clave, recibiendo un userName,
    un arreglo de pregustas, y un arreglo de respuestas las cuales fueron llenadas al crear el usuario.
    valida que la información coincida con la del usuario en la base de datos
    y cambia la clave del usuario por la recibida a través de parámetros
    retornando un true si todo esta correcto o false si no coincide alguna información
  */
  async VerifyUser(userReset: UserReset): Promise<boolean> {
    let user = await this.UserExist(userReset.userName);
    if (user != null) {
      if (user.questions[0] == userReset.questions[0] && user.questions[1] == userReset.questions[1] && user.replies[0] == userReset.replies[0] && user.replies[1] == userReset.replies[1]) {
        user.password = new EncryptDecrypt().Encrypt(userReset.password);
        this.userRepository.replaceById(user.id, user);
        return true;
      } else {
        throw new HttpErrors[403]("Los datos proporcionados no coinciden con los del usuario registrado.")
      }
    } else {
      throw new HttpErrors[403]("El usuario solicitado no se encuentra registrado.")
    }

  }


  // verifica si el usuario exite apartir del user name. Retorna el usuario o null
  async UserExist(userName: string): Promise<User | null> {
    return await this.userRepository.findOne({where: {userName: userName}});
  }



  // realiza el proceso de cambio de clave.
  async ChangePassword(userChange: UserChangePassword): Promise<boolean> {

    let password = new EncryptDecrypt().Encrypt(userChange.password)

    if (userChange.user.password == password) {
      userChange.user.password = new EncryptDecrypt().Encrypt(userChange.newPassword);
      this.userRepository.replaceById(userChange.user.id, userChange.user);
      return true;
    } else {
      throw new HttpErrors[403]("La clave ingresada es incorrecta.")
    }

  }

  // realiza el proceso de generar un token partiendo de los datos del usuario
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

  // verifica si el token recibido es válido y el usuario posee el rol 1 (User)
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

  // verifica si el token recibido es válido y el usuario posee el rol 2 (Admin)
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


  // extrae un token enviado por la request de tipo bearer.
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
