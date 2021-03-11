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
  Payment,
} from '../models';
import {TurnRepository} from '../repositories';

export class TurnPaymentController {
  constructor(
    @repository(TurnRepository) protected turnRepository: TurnRepository,
  ) { }

  @get('/turns/{id}/payments', {
    responses: {
      '200': {
        description: 'Array of Turn has many Payment',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Payment)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Payment>,
  ): Promise<Payment[]> {
    return this.turnRepository.payments(id).find(filter);
  }

  @post('/turns/{id}/payments', {
    responses: {
      '200': {
        description: 'Turn model instance',
        content: {'application/json': {schema: getModelSchemaRef(Payment)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Turn.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payment, {
            title: 'NewPaymentInTurn',
            exclude: ['id'],
            optional: ['turnId']
          }),
        },
      },
    }) payment: Omit<Payment, 'id'>,
  ): Promise<Payment> {
    return this.turnRepository.payments(id).create(payment);
  }

  @patch('/turns/{id}/payments', {
    responses: {
      '200': {
        description: 'Turn.Payment PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payment, {partial: true}),
        },
      },
    })
    payment: Partial<Payment>,
    @param.query.object('where', getWhereSchemaFor(Payment)) where?: Where<Payment>,
  ): Promise<Count> {
    return this.turnRepository.payments(id).patch(payment, where);
  }

  @del('/turns/{id}/payments', {
    responses: {
      '200': {
        description: 'Turn.Payment DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Payment)) where?: Where<Payment>,
  ): Promise<Count> {
    return this.turnRepository.payments(id).delete(where);
  }
}
