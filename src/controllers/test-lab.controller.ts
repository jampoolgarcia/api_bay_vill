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
import {TestLab} from '../models';
import {TestLabRepository} from '../repositories';

export class TestLabController {
  constructor(
    @repository(TestLabRepository)
    public testLabRepository : TestLabRepository,
  ) {}

  @post('/test-lab', {
    responses: {
      '200': {
        description: 'TestLab model instance',
        content: {'application/json': {schema: getModelSchemaRef(TestLab)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TestLab, {
            title: 'NewTestLab',
            exclude: ['id'],
          }),
        },
      },
    })
    testLab: Omit<TestLab, 'id'>,
  ): Promise<TestLab> {
    return this.testLabRepository.create(testLab);
  }

  @get('/test-lab/count', {
    responses: {
      '200': {
        description: 'TestLab model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(TestLab) where?: Where<TestLab>,
  ): Promise<Count> {
    return this.testLabRepository.count(where);
  }

  @get('/test-lab', {
    responses: {
      '200': {
        description: 'Array of TestLab model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(TestLab, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(TestLab) filter?: Filter<TestLab>,
  ): Promise<TestLab[]> {
    return this.testLabRepository.find(filter);
  }

  @patch('/test-lab', {
    responses: {
      '200': {
        description: 'TestLab PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TestLab, {partial: true}),
        },
      },
    })
    testLab: TestLab,
    @param.where(TestLab) where?: Where<TestLab>,
  ): Promise<Count> {
    return this.testLabRepository.updateAll(testLab, where);
  }

  @get('/test-lab/{id}', {
    responses: {
      '200': {
        description: 'TestLab model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(TestLab, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(TestLab, {exclude: 'where'}) filter?: FilterExcludingWhere<TestLab>
  ): Promise<TestLab> {
    return this.testLabRepository.findById(id, filter);
  }

  @patch('/test-lab/{id}', {
    responses: {
      '204': {
        description: 'TestLab PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TestLab, {partial: true}),
        },
      },
    })
    testLab: TestLab,
  ): Promise<void> {
    await this.testLabRepository.updateById(id, testLab);
  }

  @put('/test-lab/{id}', {
    responses: {
      '204': {
        description: 'TestLab PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() testLab: TestLab,
  ): Promise<void> {
    await this.testLabRepository.replaceById(id, testLab);
  }

  @del('/test-lab/{id}', {
    responses: {
      '204': {
        description: 'TestLab DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.testLabRepository.deleteById(id);
  }
}
