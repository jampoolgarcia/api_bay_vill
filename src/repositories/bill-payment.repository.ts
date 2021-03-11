import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {BillPayment, BillPaymentRelations, Ticket} from '../models';
import {TicketRepository} from './ticket.repository';

export class BillPaymentRepository extends DefaultCrudRepository<
  BillPayment,
  typeof BillPayment.prototype.id,
  BillPaymentRelations
> {

  public readonly ticket: BelongsToAccessor<Ticket, typeof BillPayment.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('TicketRepository') protected ticketRepositoryGetter: Getter<TicketRepository>,
  ) {
    super(BillPayment, dataSource);
    this.ticket = this.createBelongsToAccessorFor('ticket', ticketRepositoryGetter,);
    this.registerInclusionResolver('ticket', this.ticket.inclusionResolver);
  }
}
