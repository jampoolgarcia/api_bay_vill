import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  User,
  Turn,
} from '../models';
import {UserRepository} from '../repositories';

export class UserTurnController {
  constructor(
    @repository(UserRepository) protected userRepository: UserRepository,
  ) { }

  @get('/users/{id}/turns', {
    responses: {
      '200': {
        description: 'Array of User has many Turn',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Turn)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Turn>,
  ): Promise<Turn[]> {
    return this.userRepository.turn(id).find(filter);
  }

  @post('/users/{id}/turns', {
    responses: {
      '200': {
        description: 'User model instance',
        content: {'application/json': {schema: getModelSchemaRef(Turn)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof User.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Turn, {
            title: 'NewTurnInUser',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) turn: Omit<Turn, 'id'>,
  ): Promise<Turn> {
    return this.userRepository.turn(id).create(turn);
  }

  @patch('/users/{id}/turns', {
    responses: {
      '200': {
        description: 'User.Turn PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Turn, {partial: true}),
        },
      },
    })
    turn: Partial<Turn>,
    @param.query.object('where', getWhereSchemaFor(Turn)) where?: Where<Turn>,
  ): Promise<Count> {
    return this.userRepository.turn(id).patch(turn, where);
  }

  @del('/users/{id}/turns', {
    responses: {
      '200': {
        description: 'User.Turn DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Turn)) where?: Where<Turn>,
  ): Promise<Count> {
    return this.userRepository.turn(id).delete(where);
  }
}
