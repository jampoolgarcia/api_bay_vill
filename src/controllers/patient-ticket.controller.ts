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
  Patient,
  Ticket,
} from '../models';
import {PatientRepository} from '../repositories';

export class PatientTicketController {
  constructor(
    @repository(PatientRepository) protected patientRepository: PatientRepository,
  ) { }

  @get('/patients/{id}/tickets', {
    responses: {
      '200': {
        description: 'Array of Patient has many Ticket',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Ticket)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Ticket>,
  ): Promise<Ticket[]> {
    return this.patientRepository.ticket(id).find(filter);
  }

  @post('/patients/{id}/tickets', {
    responses: {
      '200': {
        description: 'Patient model instance',
        content: {'application/json': {schema: getModelSchemaRef(Ticket)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Patient.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ticket, {
            title: 'NewTicketInPatient',
            exclude: ['id'],
            optional: ['patientId']
          }),
        },
      },
    }) ticket: Omit<Ticket, 'id'>,
  ): Promise<Ticket> {
    return this.patientRepository.ticket(id).create(ticket);
  }

  @patch('/patients/{id}/tickets', {
    responses: {
      '200': {
        description: 'Patient.Ticket PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ticket, {partial: true}),
        },
      },
    })
    ticket: Partial<Ticket>,
    @param.query.object('where', getWhereSchemaFor(Ticket)) where?: Where<Ticket>,
  ): Promise<Count> {
    return this.patientRepository.ticket(id).patch(ticket, where);
  }

  @del('/patients/{id}/tickets', {
    responses: {
      '200': {
        description: 'Patient.Ticket DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Ticket)) where?: Where<Ticket>,
  ): Promise<Count> {
    return this.patientRepository.ticket(id).delete(where);
  }
}
