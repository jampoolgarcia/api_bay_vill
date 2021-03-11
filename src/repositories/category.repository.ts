import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Category, CategoryRelations, Medicine} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {MedicineRepository} from './medicine.repository';

export class CategoryRepository extends DefaultCrudRepository<
  Category,
  typeof Category.prototype.id,
  CategoryRelations
> {

  public readonly medicine: HasManyRepositoryFactory<Medicine, typeof Category.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('MedicineRepository') protected medicineRepositoryGetter: Getter<MedicineRepository>,
  ) {
    super(Category, dataSource);
    this.medicine = this.createHasManyRepositoryFactoryFor('medicine', medicineRepositoryGetter,);
    this.registerInclusionResolver('medicine', this.medicine.inclusionResolver);
  }
}
