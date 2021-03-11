import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {PaymentTypes, PaymentTypesRelations, Payment} from '../models';
import {PaymentRepository} from './payment.repository';

export class PaymentTypesRepository extends DefaultCrudRepository<
  PaymentTypes,
  typeof PaymentTypes.prototype.id,
  PaymentTypesRelations
  > {

  public readonly payment: HasManyRepositoryFactory<Payment, typeof PaymentTypes.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('PaymentRepository') protected paymentRepositoryGetter: Getter<PaymentRepository>,
  ) {
    super(PaymentTypes, dataSource);
    this.payment = this.createHasManyRepositoryFactoryFor('payment', paymentRepositoryGetter,);
    this.registerInclusionResolver('payment', this.payment.inclusionResolver);
  }
}
