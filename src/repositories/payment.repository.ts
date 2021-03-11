import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Payment, PaymentRelations, PaymentTypes, Doctor, Nurse, Turn} from '../models';
import {PaymentTypesRepository} from './payment-types.repository';
import {DoctorRepository} from './doctor.repository';
import {NurseRepository} from './nurse.repository';
import {TurnRepository} from './turn.repository';

export class PaymentRepository extends DefaultCrudRepository<
  Payment,
  typeof Payment.prototype.id,
  PaymentRelations
> {

  public readonly paymentTypes: BelongsToAccessor<PaymentTypes, typeof Payment.prototype.id>;

  public readonly doctor: BelongsToAccessor<Doctor, typeof Payment.prototype.id>;

  public readonly nurse: BelongsToAccessor<Nurse, typeof Payment.prototype.id>;

  public readonly turn: BelongsToAccessor<Turn, typeof Payment.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('PaymentTypesRepository') protected paymentTypesRepositoryGetter: Getter<PaymentTypesRepository>, @repository.getter('DoctorRepository') protected doctorRepositoryGetter: Getter<DoctorRepository>, @repository.getter('NurseRepository') protected nurseRepositoryGetter: Getter<NurseRepository>, @repository.getter('TurnRepository') protected turnRepositoryGetter: Getter<TurnRepository>,
  ) {
    super(Payment, dataSource);
    this.turn = this.createBelongsToAccessorFor('turn', turnRepositoryGetter,);
    this.registerInclusionResolver('turn', this.turn.inclusionResolver);
    this.nurse = this.createBelongsToAccessorFor('nurse', nurseRepositoryGetter,);
    this.registerInclusionResolver('nurse', this.nurse.inclusionResolver);
    this.doctor = this.createBelongsToAccessorFor('doctor', doctorRepositoryGetter,);
    this.registerInclusionResolver('doctor', this.doctor.inclusionResolver);
    this.paymentTypes = this.createBelongsToAccessorFor('paymentTypes', paymentTypesRepositoryGetter,);
    this.registerInclusionResolver('paymentTypes', this.paymentTypes.inclusionResolver);
  }
}
