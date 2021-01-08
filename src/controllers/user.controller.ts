import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param,


  patch, post,




  put,

  requestBody
} from '@loopback/rest';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {AuthService, Credencials, UserChangePassword, UserReset} from '../services/auth.service';
import {EncryptDecrypt} from '../services/encrypt-decrypt.service';



export class UserController {

  authService: AuthService;
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
  ) {
    this.authService = new AuthService(this.userRepository)
  }

  /*
   EndPoint @post(/user/change-password)
   Recibe un string que contiene la password nueva
   Nota: este Endpoint está protegido por estrategias
    de seguridad con el nombre: "AdminTokenStrategy”
     "UserTokenStrategy”
  */
  @authenticate("UserTokenStrategy", "AdminTokenStrategy")
  @post('/user/change-password', {
    responses: {
      '200': {
        description: 'reset password for user'
      },
    },
  })
  async changePassword(
    @requestBody() userChangePassword: UserChangePassword
  ): Promise<boolean> {
    let r = await this.authService.ChangePassword(userChangePassword);
    return r;
  }

  /*
   EndPoint @post(/user/reset-password)
   Recibe un objeto de tipo UserReset que contiene
   los datos necesarios para el cambio de contraseña en caso de olvido
  */
  @post('/user/reset-password', {
    responses: {
      '200': {
        description: 'reset password for user'
      },
    },
  })
  async resetPassword(
    @requestBody() UserReset: UserReset
  ): Promise<boolean> {
    let r = await this.authService.VerifyUser(UserReset);
    return r;
  }

  /*
    EndPoint @post(/user/login)
    Realiza todo lo necesario para el inicio de
    sesión, recibe un objeto del tipo credencials y devolviendo
    un usuario con token para usar como acceso en los otro endpoint
   */
  @post('/user/login', {
    responses: {
      '200': {
        description: 'Login for user'
      },
    },
  })
  async login(
    @requestBody({
      description: 'Credencials',
      required: true
    }) credencials: Credencials
  ): Promise<Object> {
    let user = await this.authService.Identify(credencials);
    if (user) {
      if (user.isActive) {
        let tk = await this.authService.GenerateToken(user);
        return {
          user,
          token: tk
        }
      } else {
        throw new HttpErrors[401]("El usuario no se encuentra activado.")
      }
    } else {
      throw new HttpErrors[401]("El usuario o la clave es invalido.")
    }
  }

  /*
   EndPoint @post('/user')
   Realiza todo lo necesario para la creación de un
   usuario recibiendo un objeto del tipo usuario
   */
  @post('/user', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(User)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id'],
          }),
        },
      },
    })
    user: Omit<User, 'id'>,
  ): Promise<User> {
    user.password = new EncryptDecrypt().Encrypt(user.password);
    let u = await this.userRepository.create(user);
    u.password = "";
    return u;
  }


  /*
  EndPoint @get(/user/count)
  Devuelve la cantidad en número de usuarios
  */
  @get('/user/count', {
    responses: {
      '200': {
        description: 'User model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  /*
    EndPoint @get(/user)
    Devuelve la lista de usuarios.
    Nota: este Endpoint está protegido por una estrategia
    de seguridad con el nombre: "AdminTokenStrategy”
  */
  @authenticate("AdminTokenStrategy")
  @get('/user', {
    responses: {
      '200': {
        description: 'Array of User model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(User, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  /*
    EndPoint @patch(/user)
    recibe un objeto de tipo usuario con los campos que
    se desean modificar y una condición para indicar a
    que usuario se va a modificar.
    Nota: este Endpoint está protegido por una estrategia
    de seguridad con el nombre: "AdminTokenStrategy”
  */
  @authenticate("AdminTokenStrategy")
  @patch('/user', {
    responses: {
      '200': {
        description: 'User PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  /*
    EndPoint @get(/user/{id})
    Devuelve el usuario con el id indicado en el url.
    Nota: este Endpoint está protegido por una estrategia
    de seguridad con el nombre: "AdminTokenStrategy”
  */
  @authenticate("AdminTokenStrategy")
  @get('/user/{id}', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }


  /*
   EndPoint @patch(/user/{id})
   Recibe un objeto de tipo usuario y modifica los campos
   al usuario con el id indicado en el url.
   Nota: este Endpoint está protegido por una estrategia
   de seguridad con el nombre: "AdminTokenStrategy”
 */
  @authenticate("AdminTokenStrategy")
  @patch('/user/{id}', {
    responses: {
      '204': {
        description: 'User PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  /*
   EndPoint @put(/user/{id})
   Recibe un objeto de tipo usuario y modifica
   al usuario con el id indicado en el url.
   Nota: este Endpoint está protegido por una estrategia
   de seguridad con el nombre: "AdminTokenStrategy”
 */
  @authenticate("AdminTokenStrategy")
  @put('/user/{id}', {
    responses: {
      '204': {
        description: 'User PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }


  /*
    EndPoint @del(/user/{id})
    Elimina el usuario con el id indicado en el url.
    Nota: este Endpoint está protegido por una estrategia
    de seguridad con el nombre: "AdminTokenStrategy”
  */
  @authenticate("AdminTokenStrategy")
  @del('/user/{id}', {
    responses: {
      '204': {
        description: 'User DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
