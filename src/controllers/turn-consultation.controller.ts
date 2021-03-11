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
  Turn,
  Consultation,
} from '../models';
import {TurnRepository} from '../repositories';

export class TurnConsultationController {
  constructor(
    @repository(TurnRepository) protected turnRepository: TurnRepository,
  ) { }

  @get('/turns/{id}/consultations', {
    responses: {
      '200': {
        description: 'Array of Turn has many Consultation',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Consultation)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Consultation>,
  ): Promise<Consultation[]> {
    return this.turnRepository.consultation(id).find(filter);
  }

  @post('/turns/{id}/consultations', {
    responses: {
      '200': {
        description: 'Turn model instance',
        content: {'application/json': {schema: getModelSchemaRef(Consultation)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Turn.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Consultation, {
            title: 'NewConsultationInTurn',
            exclude: ['id'],
            optional: ['turnId']
          }),
        },
      },
    }) consultation: Omit<Consultation, 'id'>,
  ): Promise<Consultation> {
    return this.turnRepository.consultation(id).create(consultation);
  }

  @patch('/turns/{id}/consultations', {
    responses: {
      '200': {
        description: 'Turn.Consultation PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Consultation, {partial: true}),
        },
      },
    })
    consultation: Partial<Consultation>,
    @param.query.object('where', getWhereSchemaFor(Consultation)) where?: Where<Consultation>,
  ): Promise<Count> {
    return this.turnRepository.consultation(id).patch(consultation, where);
  }

  @del('/turns/{id}/consultations', {
    responses: {
      '200': {
        description: 'Turn.Consultation DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Consultation)) where?: Where<Consultation>,
  ): Promise<Count> {
    return this.turnRepository.consultation(id).delete(where);
  }
}
