import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Ticket,
  Patient,
} from '../models';
import {TicketRepository} from '../repositories';

export class TicketPatientController {
  constructor(
    @repository(TicketRepository)
    public ticketRepository: TicketRepository,
  ) { }

  @get('/tickets/{id}/patient', {
    responses: {
      '200': {
        description: 'Patient belonging to Ticket',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Patient)},
          },
        },
      },
    },
  })
  async getPatient(
    @param.path.string('id') id: typeof Ticket.prototype.id,
  ): Promise<Patient> {
    return this.ticketRepository.patient(id);
  }
}
