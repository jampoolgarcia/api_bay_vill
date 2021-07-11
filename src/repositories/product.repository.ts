import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Product, ProductRelations, Medicine, Ticket} from '../models';
import {MedicineRepository} from './medicine.repository';
import {TicketRepository} from './ticket.repository';

export class ProductRepository extends DefaultCrudRepository<
  Product,
  typeof Product.prototype.id,
  ProductRelations
> {

  public readonly medicine: BelongsToAccessor<Medicine, typeof Product.prototype.id>;

  public readonly ticket: BelongsToAccessor<Ticket, typeof Product.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('MedicineRepository') protected medicineRepositoryGetter: Getter<MedicineRepository>, @repository.getter('TicketRepository') protected ticketRepositoryGetter: Getter<TicketRepository>,
  ) {
    super(Product, dataSource);
    this.ticket = this.createBelongsToAccessorFor('ticket', ticketRepositoryGetter,);
    this.registerInclusionResolver('ticket', this.ticket.inclusionResolver);
    this.medicine = this.createBelongsToAccessorFor('medicine', medicineRepositoryGetter,);
    this.registerInclusionResolver('medicine', this.medicine.inclusionResolver);
  }
}
