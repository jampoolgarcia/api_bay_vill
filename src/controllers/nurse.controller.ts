import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Nurse} from '../models';
import {NurseRepository} from '../repositories';

export class NurseController {
  constructor(
    @repository(NurseRepository)
    public nurseRepository : NurseRepository,
  ) {}

  @post('/nurse', {
    responses: {
      '200': {
        description: 'Nurse model instance',
        content: {'application/json': {schema: getModelSchemaRef(Nurse)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Nurse, {
            title: 'NewNurse',
            exclude: ['id'],
          }),
        },
      },
    })
    nurse: Omit<Nurse, 'id'>,
  ): Promise<Nurse> {
    return this.nurseRepository.create(nurse);
  }

  @get('/nurse/count', {
    responses: {
      '200': {
        description: 'Nurse model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Nurse) where?: Where<Nurse>,
  ): Promise<Count> {
    return this.nurseRepository.count(where);
  }

  @get('/nurse', {
    responses: {
      '200': {
        description: 'Array of Nurse model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Nurse, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Nurse) filter?: Filter<Nurse>,
  ): Promise<Nurse[]> {
    return this.nurseRepository.find(filter);
  }

  @patch('/nurse', {
    responses: {
      '200': {
        description: 'Nurse PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Nurse, {partial: true}),
        },
      },
    })
    nurse: Nurse,
    @param.where(Nurse) where?: Where<Nurse>,
  ): Promise<Count> {
    return this.nurseRepository.updateAll(nurse, where);
  }

  @get('/nurse/{id}', {
    responses: {
      '200': {
        description: 'Nurse model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Nurse, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Nurse, {exclude: 'where'}) filter?: FilterExcludingWhere<Nurse>
  ): Promise<Nurse> {
    return this.nurseRepository.findById(id, filter);
  }

  @patch('/nurse/{id}', {
    responses: {
      '204': {
        description: 'Nurse PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Nurse, {partial: true}),
        },
      },
    })
    nurse: Nurse,
  ): Promise<void> {
    await this.nurseRepository.updateById(id, nurse);
  }

  @put('/nurse/{id}', {
    responses: {
      '204': {
        description: 'Nurse PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() nurse: Nurse,
  ): Promise<void> {
    await this.nurseRepository.replaceById(id, nurse);
  }

  @del('/nurse/{id}', {
    responses: {
      '204': {
        description: 'Nurse DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.nurseRepository.deleteById(id);
  }
}
