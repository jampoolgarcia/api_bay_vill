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
  Specialty,
  Doctor,
} from '../models';
import {SpecialtyRepository} from '../repositories';

export class SpecialtyDoctorController {
  constructor(
    @repository(SpecialtyRepository) protected specialtyRepository: SpecialtyRepository,
  ) { }

  @get('/specialties/{id}/doctors', {
    responses: {
      '200': {
        description: 'Array of Specialty has many Doctor',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Doctor)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Doctor>,
  ): Promise<Doctor[]> {
    return this.specialtyRepository.doctor(id).find(filter);
  }

  @post('/specialties/{id}/doctors', {
    responses: {
      '200': {
        description: 'Specialty model instance',
        content: {'application/json': {schema: getModelSchemaRef(Doctor)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Specialty.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Doctor, {
            title: 'NewDoctorInSpecialty',
            exclude: ['id'],
            optional: ['specialtyId']
          }),
        },
      },
    }) doctor: Omit<Doctor, 'id'>,
  ): Promise<Doctor> {
    return this.specialtyRepository.doctor(id).create(doctor);
  }

  @patch('/specialties/{id}/doctors', {
    responses: {
      '200': {
        description: 'Specialty.Doctor PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Doctor, {partial: true}),
        },
      },
    })
    doctor: Partial<Doctor>,
    @param.query.object('where', getWhereSchemaFor(Doctor)) where?: Where<Doctor>,
  ): Promise<Count> {
    return this.specialtyRepository.doctor(id).patch(doctor, where);
  }

  @del('/specialties/{id}/doctors', {
    responses: {
      '200': {
        description: 'Specialty.Doctor DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Doctor)) where?: Where<Doctor>,
  ): Promise<Count> {
    return this.specialtyRepository.doctor(id).delete(where);
  }
}
