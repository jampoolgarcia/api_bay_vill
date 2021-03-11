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
  Ticket,
  BillPayment,
} from '../models';
import {TicketRepository} from '../repositories';

export class TicketBillPaymentController {
  constructor(
    @repository(TicketRepository) protected ticketRepository: TicketRepository,
  ) { }

  @get('/tickets/{id}/bill-payments', {
    responses: {
      '200': {
        description: 'Array of Ticket has many BillPayment',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(BillPayment)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<BillPayment>,
  ): Promise<BillPayment[]> {
    return this.ticketRepository.billPayment(id).find(filter);
  }

  @post('/tickets/{id}/bill-payments', {
    responses: {
      '200': {
        description: 'Ticket model instance',
        content: {'application/json': {schema: getModelSchemaRef(BillPayment)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Ticket.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BillPayment, {
            title: 'NewBillPaymentInTicket',
            exclude: ['id'],
            optional: ['ticketId']
          }),
        },
      },
    }) billPayment: Omit<BillPayment, 'id'>,
  ): Promise<BillPayment> {
    return this.ticketRepository.billPayment(id).create(billPayment);
  }

  @patch('/tickets/{id}/bill-payments', {
    responses: {
      '200': {
        description: 'Ticket.BillPayment PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BillPayment, {partial: true}),
        },
      },
    })
    billPayment: Partial<BillPayment>,
    @param.query.object('where', getWhereSchemaFor(BillPayment)) where?: Where<BillPayment>,
  ): Promise<Count> {
    return this.ticketRepository.billPayment(id).patch(billPayment, where);
  }

  @del('/tickets/{id}/bill-payments', {
    responses: {
      '200': {
        description: 'Ticket.BillPayment DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(BillPayment)) where?: Where<BillPayment>,
  ): Promise<Count> {
    return this.ticketRepository.billPayment(id).delete(where);
  }
}
