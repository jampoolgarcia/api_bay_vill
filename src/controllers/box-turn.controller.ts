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
  Box,
  Turn,
} from '../models';
import {BoxRepository} from '../repositories';

export class BoxTurnController {
  constructor(
    @repository(BoxRepository) protected boxRepository: BoxRepository,
  ) { }

  @get('/boxes/{id}/turns', {
    responses: {
      '200': {
        description: 'Array of Box has many Turn',
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
    return this.boxRepository.turn(id).find(filter);
  }

  @post('/boxes/{id}/turns', {
    responses: {
      '200': {
        description: 'Box model instance',
        content: {'application/json': {schema: getModelSchemaRef(Turn)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Box.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Turn, {
            title: 'NewTurnInBox',
            exclude: ['id'],
            optional: ['boxId']
          }),
        },
      },
    }) turn: Omit<Turn, 'id'>,
  ): Promise<Turn> {
    return this.boxRepository.turn(id).create(turn);
  }

  @patch('/boxes/{id}/turns', {
    responses: {
      '200': {
        description: 'Box.Turn PATCH success count',
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
    return this.boxRepository.turn(id).patch(turn, where);
  }

  @del('/boxes/{id}/turns', {
    responses: {
      '200': {
        description: 'Box.Turn DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Turn)) where?: Where<Turn>,
  ): Promise<Count> {
    return this.boxRepository.turn(id).delete(where);
  }
}
