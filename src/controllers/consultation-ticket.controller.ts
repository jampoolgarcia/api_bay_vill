import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Consultation,
  Ticket,
} from '../models';
import {ConsultationRepository} from '../repositories';

export class ConsultationTicketController {
  constructor(
    @repository(ConsultationRepository)
    public consultationRepository: ConsultationRepository,
  ) { }

  @get('/consultations/{id}/ticket', {
    responses: {
      '200': {
        description: 'Ticket belonging to Consultation',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Ticket)},
          },
        },
      },
    },
  })
  async getTicket(
    @param.path.string('id') id: typeof Consultation.prototype.id,
  ): Promise<Ticket> {
    return this.consultationRepository.ticket(id);
  }
}
