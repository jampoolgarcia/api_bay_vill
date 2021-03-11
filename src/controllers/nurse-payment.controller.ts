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
  Nurse,
  Payment,
} from '../models';
import {NurseRepository} from '../repositories';

export class NursePaymentController {
  constructor(
    @repository(NurseRepository) protected nurseRepository: NurseRepository,
  ) { }

  @get('/nurses/{id}/payments', {
    responses: {
      '200': {
        description: 'Array of Nurse has many Payment',
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
    return this.nurseRepository.payments(id).find(filter);
  }

  @post('/nurses/{id}/payments', {
    responses: {
      '200': {
        description: 'Nurse model instance',
        content: {'application/json': {schema: getModelSchemaRef(Payment)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Nurse.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payment, {
            title: 'NewPaymentInNurse',
            exclude: ['id'],
            optional: ['nurseId']
          }),
        },
      },
    }) payment: Omit<Payment, 'id'>,
  ): Promise<Payment> {
    return this.nurseRepository.payments(id).create(payment);
  }

  @patch('/nurses/{id}/payments', {
    responses: {
      '200': {
        description: 'Nurse.Payment PATCH success count',
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
    return this.nurseRepository.payments(id).patch(payment, where);
  }

  @del('/nurses/{id}/payments', {
    responses: {
      '200': {
        description: 'Nurse.Payment DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Payment)) where?: Where<Payment>,
  ): Promise<Count> {
    return this.nurseRepository.payments(id).delete(where);
  }
}
