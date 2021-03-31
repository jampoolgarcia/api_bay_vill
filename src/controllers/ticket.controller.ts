import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param,


  patch, post,




  put,

  requestBody,
  response
} from '@loopback/rest';
import {Consultation, Ticket} from '../models';
import {ConsultationRepository, DoctorRepository, TicketRepository} from '../repositories';
import {ConsultationService} from '../services/consultation.service';

export class TicketController {

  public consultationService: ConsultationService;

  constructor(
    @repository(TicketRepository)
    public ticketRepository: TicketRepository,
    @repository(ConsultationRepository)
    public consultationRepo: ConsultationRepository,
    @repository(DoctorRepository)
    public doctorRepo: DoctorRepository
  ) {
    this.consultationService = new ConsultationService(consultationRepo, doctorRepo);
  }

  @post('/ticket')
  @response(200, {
    description: 'Ticket model instance',
    content: {'application/json': {schema: getModelSchemaRef(Ticket)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ticket, {
            title: 'NewTicket',
            exclude: ['id'],
          }),
        },
      },
    })
    ticket: Omit<Ticket, 'id'>,
  ): Promise<Ticket> {
    return this.ticketRepository.create(ticket);
  }

  @get('/ticket/count')
  @response(200, {
    description: 'Ticket model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Ticket) where?: Where<Ticket>,
  ): Promise<Count> {
    return this.ticketRepository.count(where);
  }

  @get('/ticket')
  @response(200, {
    description: 'Array of Ticket model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Ticket, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Ticket) filter?: Filter<Ticket>,
  ): Promise<Ticket[]> {
    return this.ticketRepository.find(filter);
  }

  @post('/ticket/{id}/consultation', {
    responses: {
      '200': {
        description: 'Consultation model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Consultation,
              {
                title: 'New Consultation',
                exclude: ['id', 'ticketId'],
              })
          }
        },
      },
    },
  })
  async addConsultation(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Consultation, {
            exclude: ['id', 'ticketId'],
          }),
        },
      },
    })
    consultation: Omit<Consultation, 'id'>,
  ): Promise<boolean> {


    return this.consultationService.add(consultation);

  }


  @patch('/ticket')
  @response(200, {
    description: 'Ticket PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ticket, {partial: true}),
        },
      },
    })
    ticket: Ticket,
    @param.where(Ticket) where?: Where<Ticket>,
  ): Promise<Count> {
    return this.ticketRepository.updateAll(ticket, where);
  }

  @get('/ticket/{id}')
  @response(200, {
    description: 'Ticket model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Ticket, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Ticket, {exclude: 'where'}) filter?: FilterExcludingWhere<Ticket>
  ): Promise<Ticket> {
    return this.ticketRepository.findById(id, filter);
  }

  @patch('/ticket/{id}')
  @response(204, {
    description: 'Ticket PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ticket, {partial: true}),
        },
      },
    })
    ticket: Ticket,
  ): Promise<void> {
    await this.ticketRepository.updateById(id, ticket);
  }

  @put('/ticket/{id}')
  @response(204, {
    description: 'Ticket PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() ticket: Ticket,
  ): Promise<void> {
    await this.ticketRepository.replaceById(id, ticket);
  }

  @del('/ticket/{id}')
  @response(204, {
    description: 'Ticket DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.ticketRepository.deleteById(id);
  }
}
