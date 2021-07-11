import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Ticket, TicketRelations, Patient, Consultation, BillPayment, Product} from '../models';
import {PatientRepository} from './patient.repository';
import {ConsultationRepository} from './consultation.repository';
import {BillPaymentRepository} from './bill-payment.repository';
import {ProductRepository} from './product.repository';

export class TicketRepository extends DefaultCrudRepository<
  Ticket,
  typeof Ticket.prototype.id,
  TicketRelations
> {

  public readonly patient: BelongsToAccessor<Patient, typeof Ticket.prototype.id>;

  public readonly consultation: HasManyRepositoryFactory<Consultation, typeof Ticket.prototype.id>;

  public readonly billPayment: HasManyRepositoryFactory<BillPayment, typeof Ticket.prototype.id>;

  public readonly product: HasManyRepositoryFactory<Product, typeof Ticket.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('PatientRepository') protected patientRepositoryGetter: Getter<PatientRepository>, @repository.getter('ConsultationRepository') protected consultationRepositoryGetter: Getter<ConsultationRepository>, @repository.getter('BillPaymentRepository') protected billPaymentRepositoryGetter: Getter<BillPaymentRepository>, @repository.getter('ProductRepository') protected productRepositoryGetter: Getter<ProductRepository>,
  ) {
    super(Ticket, dataSource);
    this.product = this.createHasManyRepositoryFactoryFor('product', productRepositoryGetter,);
    this.registerInclusionResolver('product', this.product.inclusionResolver);
    this.billPayment = this.createHasManyRepositoryFactoryFor('billPayment', billPaymentRepositoryGetter,);
    this.registerInclusionResolver('billPayment', this.billPayment.inclusionResolver);
    this.consultation = this.createHasManyRepositoryFactoryFor('consultation', consultationRepositoryGetter,);
    this.registerInclusionResolver('consultation', this.consultation.inclusionResolver);
    this.patient = this.createBelongsToAccessorFor('patient', patientRepositoryGetter,);
    this.registerInclusionResolver('patient', this.patient.inclusionResolver);
  }
}
