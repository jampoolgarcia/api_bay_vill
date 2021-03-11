import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Doctor,
  Specialty,
} from '../models';
import {DoctorRepository} from '../repositories';

export class DoctorSpecialtyController {
  constructor(
    @repository(DoctorRepository)
    public doctorRepository: DoctorRepository,
  ) { }

  @get('/doctors/{id}/specialty', {
    responses: {
      '200': {
        description: 'Specialty belonging to Doctor',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Specialty)},
          },
        },
      },
    },
  })
  async getSpecialty(
    @param.path.string('id') id: typeof Doctor.prototype.id,
  ): Promise<Specialty> {
    return this.doctorRepository.specialty(id);
  }
}
