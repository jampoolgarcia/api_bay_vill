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
  Turn,
} from '../models';
import {PaymentRepository} from '../repositories';

export class PaymentTurnController {
  constructor(
    @repository(PaymentRepository)
    public paymentRepository: PaymentRepository,
  ) { }

  @get('/payments/{id}/turn', {
    responses: {
      '200': {
        description: 'Turn belonging to Payment',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Turn)},
          },
        },
      },
    },
  })
  async getTurn(
    @param.path.string('id') id: typeof Payment.prototype.id,
  ): Promise<Turn> {
    return this.paymentRepository.turn(id);
  }
}
