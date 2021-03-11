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
  PaymentTypes,
  Payment,
} from '../models';
import {PaymentTypesRepository} from '../repositories';

export class PaymentTypesPaymentController {
  constructor(
    @repository(PaymentTypesRepository) protected paymentTypesRepository: PaymentTypesRepository,
  ) { }

  @get('/payment-types/{id}/payments', {
    responses: {
      '200': {
        description: 'Array of PaymentTypes has many Payment',
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
    return this.paymentTypesRepository.payment(id).find(filter);
  }

  @post('/payment-types/{id}/payments', {
    responses: {
      '200': {
        description: 'PaymentTypes model instance',
        content: {'application/json': {schema: getModelSchemaRef(Payment)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof PaymentTypes.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payment, {
            title: 'NewPaymentInPaymentTypes',
            exclude: ['id'],
            optional: ['paymentTypesId']
          }),
        },
      },
    }) payment: Omit<Payment, 'id'>,
  ): Promise<Payment> {
    return this.paymentTypesRepository.payment(id).create(payment);
  }

  @patch('/payment-types/{id}/payments', {
    responses: {
      '200': {
        description: 'PaymentTypes.Payment PATCH success count',
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
    return this.paymentTypesRepository.payment(id).patch(payment, where);
  }

  @del('/payment-types/{id}/payments', {
    responses: {
      '200': {
        description: 'PaymentTypes.Payment DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Payment)) where?: Where<Payment>,
  ): Promise<Count> {
    return this.paymentTypesRepository.payment(id).delete(where);
  }
}
