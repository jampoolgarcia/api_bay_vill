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

  requestBody
} from '@loopback/rest';
import {Laboratory} from '../models';
import {LaboratoryRepository} from '../repositories';

export class LaboratoryController {
  constructor(
    @repository(LaboratoryRepository)
    public laboratoryRepository: LaboratoryRepository,
  ) { }

  @post('/laboratory', {
    responses: {
      '200': {
        description: 'Laboratory model instance',
        content: {'application/json': {schema: getModelSchemaRef(Laboratory)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Laboratory, {
            title: 'NewLaboratory',
            exclude: ['id'],
          }),
        },
      },
    })
    laboratory: Omit<Laboratory, 'id'>,
  ): Promise<Laboratory> {
    return this.laboratoryRepository.create(laboratory);
  }

  @get('/laboratory/count', {
    responses: {
      '200': {
        description: 'Laboratory model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Laboratory) where?: Where<Laboratory>,
  ): Promise<Count> {
    return this.laboratoryRepository.count(where);
  }

  @get('/laboratory', {
    responses: {
      '200': {
        description: 'Array of Laboratory model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Laboratory, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Laboratory) filter?: Filter<Laboratory>,
  ): Promise<Laboratory[]> {
    return this.laboratoryRepository.find(filter);
  }

  @patch('/laboratory', {
    responses: {
      '200': {
        description: 'Laboratory PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Laboratory, {partial: true}),
        },
      },
    })
    laboratory: Laboratory,
    @param.where(Laboratory) where?: Where<Laboratory>,
  ): Promise<Count> {
    return this.laboratoryRepository.updateAll(laboratory, where);
  }

  @get('/laboratory/{id}', {
    responses: {
      '200': {
        description: 'Laboratory model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Laboratory, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Laboratory, {exclude: 'where'}) filter?: FilterExcludingWhere<Laboratory>
  ): Promise<Laboratory> {
    return this.laboratoryRepository.findById(id, filter);
  }

  @patch('/laboratory/{id}', {
    responses: {
      '204': {
        description: 'Laboratory PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Laboratory, {partial: true}),
        },
      },
    })
    laboratory: Laboratory,
  ): Promise<void> {
    await this.laboratoryRepository.updateById(id, laboratory);
  }

  @put('/laboratory/{id}', {
    responses: {
      '204': {
        description: 'Laboratory PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() laboratory: Laboratory,
  ): Promise<void> {
    await this.laboratoryRepository.replaceById(id, laboratory);
  }

  @del('/laboratory/{id}', {
    responses: {
      '204': {
        description: 'Laboratory DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.laboratoryRepository.deleteById(id);
  }
}
