import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Medicine,
  Category,
} from '../models';
import {MedicineRepository} from '../repositories';

export class MedicineCategoryController {
  constructor(
    @repository(MedicineRepository)
    public medicineRepository: MedicineRepository,
  ) { }

  @get('/medicines/{id}/category', {
    responses: {
      '200': {
        description: 'Category belonging to Medicine',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Category)},
          },
        },
      },
    },
  })
  async getCategory(
    @param.path.string('id') id: typeof Medicine.prototype.id,
  ): Promise<Category> {
    return this.medicineRepository.category(id);
  }
}
