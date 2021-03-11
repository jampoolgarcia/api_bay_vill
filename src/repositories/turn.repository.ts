import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Turn, TurnRelations, Box, User, Consultation, Payment} from '../models';
import {BoxRepository} from './box.repository';
import {UserRepository} from './user.repository';
import {ConsultationRepository} from './consultation.repository';
import {PaymentRepository} from './payment.repository';

export class TurnRepository extends DefaultCrudRepository<
  Turn,
  typeof Turn.prototype.id,
  TurnRelations
> {

  public readonly box: BelongsToAccessor<Box, typeof Turn.prototype.id>;

  public readonly user: BelongsToAccessor<User, typeof Turn.prototype.id>;

  public readonly consultation: HasManyRepositoryFactory<Consultation, typeof Turn.prototype.id>;

  public readonly payments: HasManyRepositoryFactory<Payment, typeof Turn.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('BoxRepository') protected boxRepositoryGetter: Getter<BoxRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>, @repository.getter('ConsultationRepository') protected consultationRepositoryGetter: Getter<ConsultationRepository>, @repository.getter('PaymentRepository') protected paymentRepositoryGetter: Getter<PaymentRepository>,
  ) {
    super(Turn, dataSource);
    this.payments = this.createHasManyRepositoryFactoryFor('payments', paymentRepositoryGetter,);
    this.registerInclusionResolver('payments', this.payments.inclusionResolver);
    this.consultation = this.createHasManyRepositoryFactoryFor('consultation', consultationRepositoryGetter,);
    this.registerInclusionResolver('consultation', this.consultation.inclusionResolver);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter,);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
    this.box = this.createBelongsToAccessorFor('box', boxRepositoryGetter,);
    this.registerInclusionResolver('box', this.box.inclusionResolver);
  }
}
