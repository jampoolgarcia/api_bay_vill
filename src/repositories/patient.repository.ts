import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Patient, PatientRelations, Ticket} from '../models';
import {TicketRepository} from './ticket.repository';

export class PatientRepository extends DefaultCrudRepository<
  Patient,
  typeof Patient.prototype.id,
  PatientRelations
  > {

  public readonly ticket: HasManyRepositoryFactory<Ticket, typeof Patient.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('TicketRepository') protected ticketRepositoryGetter: Getter<TicketRepository>,
  ) {
    super(Patient, dataSource);
    this.ticket = this.createHasManyRepositoryFactoryFor('ticket', ticketRepositoryGetter,);
    this.registerInclusionResolver('ticket', this.ticket.inclusionResolver);
  }
}
