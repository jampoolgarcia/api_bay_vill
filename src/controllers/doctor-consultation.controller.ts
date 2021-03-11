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
  Doctor,
  Consultation,
} from '../models';
import {DoctorRepository} from '../repositories';

export class DoctorConsultationController {
  constructor(
    @repository(DoctorRepository) protected doctorRepository: DoctorRepository,
  ) { }

  @get('/doctors/{id}/consultations', {
    responses: {
      '200': {
        description: 'Array of Doctor has many Consultation',
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
    return this.doctorRepository.consultation(id).find(filter);
  }

  @post('/doctors/{id}/consultations', {
    responses: {
      '200': {
        description: 'Doctor model instance',
        content: {'application/json': {schema: getModelSchemaRef(Consultation)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Doctor.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Consultation, {
            title: 'NewConsultationInDoctor',
            exclude: ['id'],
            optional: ['doctorId']
          }),
        },
      },
    }) consultation: Omit<Consultation, 'id'>,
  ): Promise<Consultation> {
    return this.doctorRepository.consultation(id).create(consultation);
  }

  @patch('/doctors/{id}/consultations', {
    responses: {
      '200': {
        description: 'Doctor.Consultation PATCH success count',
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
    return this.doctorRepository.consultation(id).patch(consultation, where);
  }

  @del('/doctors/{id}/consultations', {
    responses: {
      '200': {
        description: 'Doctor.Consultation DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Consultation)) where?: Where<Consultation>,
  ): Promise<Count> {
    return this.doctorRepository.consultation(id).delete(where);
  }
}
