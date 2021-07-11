import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {Medicine, MedicineRelations, Category, Product} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {CategoryRepository} from './category.repository';
import {ProductRepository} from './product.repository';

export class MedicineRepository extends DefaultCrudRepository<
  Medicine,
  typeof Medicine.prototype.id,
  MedicineRelations
> {

  public readonly category: BelongsToAccessor<Category, typeof Medicine.prototype.id>;

  public readonly product: HasManyRepositoryFactory<Product, typeof Medicine.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('CategoryRepository') protected categoryRepositoryGetter: Getter<CategoryRepository>, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(Medicine, dataSource);
    this.product = this.createHasManyRepositoryFactoryFor('product', productRepositoryGetter,);
    this.registerInclusionResolver('product', this.product.inclusionResolver);
    this.category = this.createBelongsToAccessorFor('category', categoryRepositoryGetter,);
    this.registerInclusionResolver('category', this.category.inclusionResolver);
  }
}
