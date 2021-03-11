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
  Nurse,
} from '../models';
import {PaymentRepository} from '../repositories';

export class PaymentNurseController {
  constructor(
    @repository(PaymentRepository)
    public paymentRepository: PaymentRepository,
  ) { }

  @get('/payments/{id}/nurse', {
    responses: {
      '200': {
        description: 'Nurse belonging to Payment',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Nurse)},
          },
        },
      },
    },
  })
  async getNurse(
    @param.path.string('id') id: typeof Payment.prototype.id,
  ): Promise<Nurse> {
    return this.paymentRepository.nurse(id);
  }
}
