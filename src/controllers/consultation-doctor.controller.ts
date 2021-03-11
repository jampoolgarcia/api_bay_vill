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
  Doctor,
} from '../models';
import {ConsultationRepository} from '../repositories';

export class ConsultationDoctorController {
  constructor(
    @repository(ConsultationRepository)
    public consultationRepository: ConsultationRepository,
  ) { }

  @get('/consultations/{id}/doctor', {
    responses: {
      '200': {
        description: 'Doctor belonging to Consultation',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Doctor)},
          },
        },
      },
    },
  })
  async getDoctor(
    @param.path.string('id') id: typeof Consultation.prototype.id,
  ): Promise<Doctor> {
    return this.consultationRepository.doctor(id);
  }
}
