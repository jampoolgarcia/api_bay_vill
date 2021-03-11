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
  Consultation,
} from '../models';
import {TicketRepository} from '../repositories';

export class TicketConsultationController {
  constructor(
    @repository(TicketRepository) protected ticketRepository: TicketRepository,
  ) { }

  @get('/tickets/{id}/consultations', {
    responses: {
      '200': {
        description: 'Array of Ticket has many Consultation',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Consultation)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Consultation>,
  ): Promise<Consultation[]> {
    return this.ticketRepository.consultation(id).find(filter);
  }

  @post('/tickets/{id}/consultations', {
    responses: {
      '200': {
        description: 'Ticket model instance',
        content: {'application/json': {schema: getModelSchemaRef(Consultation)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Ticket.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Consultation, {
            title: 'NewConsultationInTicket',
            exclude: ['id'],
            optional: ['ticketId']
          }),
        },
      },
    }) consultation: Omit<Consultation, 'id'>,
  ): Promise<Consultation> {
    return this.ticketRepository.consultation(id).create(consultation);
  }

  @patch('/tickets/{id}/consultations', {
    responses: {
      '200': {
        description: 'Ticket.Consultation PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Consultation, {partial: true}),
        },
      },
    })
    consultation: Partial<Consultation>,
    @param.query.object('where', getWhereSchemaFor(Consultation)) where?: Where<Consultation>,
  ): Promise<Count> {
    return this.ticketRepository.consultation(id).patch(consultation, where);
  }

  @del('/tickets/{id}/consultations', {
    responses: {
      '200': {
        description: 'Ticket.Consultation DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Consultation)) where?: Where<Consultation>,
  ): Promise<Count> {
    return this.ticketRepository.consultation(id).delete(where);
  }
}
