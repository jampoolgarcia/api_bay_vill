import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {Medicine, MedicineRelations, Category} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {CategoryRepository} from './category.repository';

export class MedicineRepository extends DefaultCrudRepository<
  Medicine,
  typeof Medicine.prototype.id,
  MedicineRelations
> {

  public readonly category: BelongsToAccessor<Category, typeof Medicine.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>,
  ) {
    super(Medicine, dataSource);
    this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter,);
    this.registerInclusionResolver('category', this.category.inclusionResolver);
  }
}
