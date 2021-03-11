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
  Category,
  Medicine,
} from '../models';
import {CategoryRepository} from '../repositories';

export class CategoryMedicineController {
  constructor(
    @repository(CategoryRepository) protected categoryRepository: CategoryRepository,
  ) { }

  @get('/categories/{id}/medicines', {
    responses: {
      '200': {
        description: 'Array of Category has many Medicine',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Medicine)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Medicine>,
  ): Promise<Medicine[]> {
    return this.categoryRepository.medicine(id).find(filter);
  }

  @post('/categories/{id}/medicines', {
    responses: {
      '200': {
        description: 'Category model instance',
        content: {'application/json': {schema: getModelSchemaRef(Medicine)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Category.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Medicine, {
            title: 'NewMedicineInCategory',
            exclude: ['id'],
            optional: ['categoryId']
          }),
        },
      },
    }) medicine: Omit<Medicine, 'id'>,
  ): Promise<Medicine> {
    return this.categoryRepository.medicine(id).create(medicine);
  }

  @patch('/categories/{id}/medicines', {
    responses: {
      '200': {
        description: 'Category.Medicine PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Medicine, {partial: true}),
        },
      },
    })
    medicine: Partial<Medicine>,
    @param.query.object('where', getWhereSchemaFor(Medicine)) where?: Where<Medicine>,
  ): Promise<Count> {
    return this.categoryRepository.medicine(id).patch(medicine, where);
  }

  @del('/categories/{id}/medicines', {
    responses: {
      '200': {
        description: 'Category.Medicine DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Medicine)) where?: Where<Medicine>,
  ): Promise<Count> {
    return this.categoryRepository.medicine(id).delete(where);
  }
}
