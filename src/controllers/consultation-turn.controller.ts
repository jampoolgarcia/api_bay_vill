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
  Turn,
} from '../models';
import {ConsultationRepository} from '../repositories';

export class ConsultationTurnController {
  constructor(
    @repository(ConsultationRepository)
    public consultationRepository: ConsultationRepository,
  ) { }

  @get('/consultations/{id}/turn', {
    responses: {
      '200': {
        description: 'Turn belonging to Consultation',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Turn)},
          },
        },
      },
    },
  })
  async getTurn(
    @param.path.string('id') id: typeof Consultation.prototype.id,
  ): Promise<Turn> {
    return this.consultationRepository.turn(id);
  }
}
