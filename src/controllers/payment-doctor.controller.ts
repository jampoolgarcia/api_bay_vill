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
  Doctor,
} from '../models';
import {PaymentRepository} from '../repositories';

export class PaymentDoctorController {
  constructor(
    @repository(PaymentRepository)
    public paymentRepository: PaymentRepository,
  ) { }

  @get('/payments/{id}/doctor', {
    responses: {
      '200': {
        description: 'Doctor belonging to Payment',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Doctor)},
          },
        },
      },
    },
  })
  async getDoctor(
    @param.path.string('id') id: typeof Payment.prototype.id,
  ): Promise<Doctor> {
    return this.paymentRepository.doctor(id);
  }
}
