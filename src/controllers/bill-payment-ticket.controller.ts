import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  BillPayment,
  Ticket,
} from '../models';
import {BillPaymentRepository} from '../repositories';

export class BillPaymentTicketController {
  constructor(
    @repository(BillPaymentRepository)
    public billPaymentRepository: BillPaymentRepository,
  ) { }

  @get('/bill-payments/{id}/ticket', {
    responses: {
      '200': {
        description: 'Ticket belonging to BillPayment',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Ticket)},
          },
        },
      },
    },
  })
  async getTicket(
    @param.path.string('id') id: typeof BillPayment.prototype.id,
  ): Promise<Ticket> {
    return this.billPaymentRepository.ticket(id);
  }
}
