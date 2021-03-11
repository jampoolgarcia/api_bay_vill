import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Nurse, NurseRelations, Payment} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {PaymentRepository} from './payment.repository';

export class NurseRepository extends DefaultCrudRepository<
  Nurse,
  typeof Nurse.prototype.id,
  NurseRelations
> {

  public readonly payments: HasManyRepositoryFactory<Payment, typeof Nurse.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('PaymentRepository') protected paymentRepositoryGetter: Getter<PaymentRepository>,
  ) {
    super(Nurse, dataSource);
    this.payments = this.createHasManyRepositoryFactoryFor('payments', paymentRepositoryGetter,);
    this.registerInclusionResolver('payments', this.payments.inclusionResolver);
  }
}
