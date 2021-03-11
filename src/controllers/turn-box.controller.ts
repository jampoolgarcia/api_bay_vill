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
  Box,
} from '../models';
import {TurnRepository} from '../repositories';

export class TurnBoxController {
  constructor(
    @repository(TurnRepository)
    public turnRepository: TurnRepository,
  ) { }

  @get('/turns/{id}/box', {
    responses: {
      '200': {
        description: 'Box belonging to Turn',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Box)},
          },
        },
      },
    },
  })
  async getBox(
    @param.path.string('id') id: typeof Turn.prototype.id,
  ): Promise<Box> {
    return this.turnRepository.box(id);
  }
}
