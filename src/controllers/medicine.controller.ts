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
import {Medicine, Product} from '../models';
import {MedicineRepository, ProductRepository} from '../repositories';

export class MedicineController {
  constructor(
    @repository(MedicineRepository)
    public medicineRepository: MedicineRepository,
    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) { }

  @post('/medicine', {
    responses: {
      '200': {
        description: 'Medicine model instance',
        content: {'application/json': {schema: getModelSchemaRef(Medicine)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Medicine, {
            title: 'NewMedicine',
            exclude: ['id'],
          }),
        },
      },
    })
    medicine: Omit<Medicine, 'id'>,
  ): Promise<Medicine> {
    return this.medicineRepository.create(medicine);
  }

  @get('/medicine/count', {
    responses: {
      '200': {
        description: 'Medicine model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Medicine) where?: Where<Medicine>,
  ): Promise<Count> {
    return this.medicineRepository.count(where);
  }

  @get('/medicine', {
    responses: {
      '200': {
        description: 'Array of Medicine model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Medicine, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Medicine) filter?: Filter<Medicine>,
  ): Promise<Medicine[]> {
    return this.medicineRepository.find(filter);
  }

  @get('/medicine/kardex/{date}', {
    responses: {
      '200': {
        description: 'Array of Product model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Product, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async findProductDay(
    @param.path.string('date') date: Date,
  ): Promise<Product[]> {
    console.log(date);
    return this.productRepository.find({"where":{"date":{"gt":"2014-04-01T18:30:00.000Z"}}});
  }


  @patch('/medicine', {
    responses: {
      '200': {
        description: 'Medicine PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Medicine, {partial: true}),
        },
      },
    })
    medicine: Medicine,
    @param.where(Medicine) where?: Where<Medicine>,
  ): Promise<Count> {
    return this.medicineRepository.updateAll(medicine, where);
  }

  @get('/medicine/{id}', {
    responses: {
      '200': {
        description: 'Medicine model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Medicine, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Medicine, {exclude: 'where'}) filter?: FilterExcludingWhere<Medicine>
  ): Promise<Medicine> {
    return this.medicineRepository.findById(id, filter);
  }

  @patch('/medicine/{id}', {
    responses: {
      '204': {
        description: 'Medicine PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Medicine, {partial: true}),
        },
      },
    })
    medicine: Medicine,
  ): Promise<void> {
    await this.medicineRepository.updateById(id, medicine);
  }

  @put('/medicine/{id}', {
    responses: {
      '204': {
        description: 'Medicine PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() medicine: Medicine,
  ): Promise<void> {
    await this.medicineRepository.replaceById(id, medicine);
  }

  @del('/medicine/{id}', {
    responses: {
      '204': {
        description: 'Medicine DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.medicineRepository.deleteById(id);
  }
}
