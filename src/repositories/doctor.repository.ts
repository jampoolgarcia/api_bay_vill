import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Consultation, Doctor, DoctorRelations, Payment, Specialty} from '../models';
import {ConsultationRepository} from './consultation.repository';
import {PaymentRepository} from './payment.repository';
import {SpecialtyRepository} from './specialty.repository';

export class DoctorRepository extends DefaultCrudRepository<
  Doctor,
  typeof Doctor.prototype.id,
  DoctorRelations
  > {

  public readonly specialty: BelongsToAccessor<Specialty, typeof Doctor.prototype.id>;

  public readonly consultation: HasManyRepositoryFactory<Consultation, typeof Doctor.prototype.id>;

  public readonly payments: HasManyRepositoryFactory<Payment, typeof Doctor.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('SpecialtyRepository') protected specialtyRepositoryGetter: Getter<SpecialtyRepository>, @repository.getter('ConsultationRepository') protected consultationRepositoryGetter: Getter<ConsultationRepository>, @repository.getter('PaymentRepository') protected paymentRepositoryGetter: Getter<PaymentRepository>,
  ) {
    super(Doctor, dataSource);
    this.payments = this.createHasManyRepositoryFactoryFor('payments', paymentRepositoryGetter,);
    this.registerInclusionResolver('payments', this.payments.inclusionResolver);
    this.consultation = this.createHasManyRepositoryFactoryFor('consultation', consultationRepositoryGetter,);
    this.registerInclusionResolver('consultation', this.consultation.inclusionResolver);
    this.specialty = this.createBelongsToAccessorFor('specialty', specialtyRepositoryGetter,);
    this.registerInclusionResolver('specialty', this.specialty.inclusionResolver);
  }

}
