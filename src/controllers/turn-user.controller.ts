import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Turn,
  User,
} from '../models';
import {TurnRepository} from '../repositories';

export class TurnUserController {
  constructor(
    @repository(TurnRepository)
    public turnRepository: TurnRepository,
  ) { }

  @get('/turns/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to Turn',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof Turn.prototype.id,
  ): Promise<User> {
    return this.turnRepository.user(id);
  }
}
