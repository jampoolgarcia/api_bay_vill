import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  Doctor,
  Payment
} from '../models';
import {DoctorRepository} from '../repositories';

export class DoctorPaymentController {
  constructor(
    @repository(DoctorRepository) protected doctorRepository: DoctorRepository,
  ) { }

  @get('/doctors/{id}/payments', {
    responses: {
      '200': {
        description: 'Array of Doctor has many Payment',
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
    return this.doctorRepository.payments(id).find(filter);
  }

  @post('/doctors/{id}/payments', {
    responses: {
      '200': {
        description: 'Doctor model instance',
        content: {'application/json': {schema: getModelSchemaRef(Payment)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Doctor.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payment, {
            title: 'NewPaymentInDoctor',
            exclude: ['id'],
            optional: ['doctorId']
          }),
        },
      },
    }) payment: Omit<Payment, 'id'>,
  ): Promise<Payment> {
    return this.doctorRepository.payments(id).create(payment);
  }

  @patch('/doctors/{id}/payments', {
    responses: {
      '200': {
        description: 'Doctor.Payment PATCH success count',
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
    return this.doctorRepository.payments(id).patch(payment, where);
  }

  @del('/doctors/{id}/payments', {
    responses: {
      '200': {
        description: 'Doctor.Payment DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Payment)) where?: Where<Payment>,
  ): Promise<Count> {
    return this.doctorRepository.payments(id).delete(where);
  }
}
