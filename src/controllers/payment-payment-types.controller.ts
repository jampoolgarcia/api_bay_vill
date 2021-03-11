import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Payment,
  PaymentTypes,
} from '../models';
import {PaymentRepository} from '../repositories';

export class PaymentPaymentTypesController {
  constructor(
    @repository(PaymentRepository)
    public paymentRepository: PaymentRepository,
  ) { }

  @get('/payments/{id}/payment-types', {
    responses: {
      '200': {
        description: 'PaymentTypes belonging to Payment',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(PaymentTypes)},
          },
        },
      },
    },
  })
  async getPaymentTypes(
    @param.path.string('id') id: typeof Payment.prototype.id,
  ): Promise<PaymentTypes> {
    return this.paymentRepository.paymentTypes(id);
  }
}
