import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Consultation, ConsultationRelations, Doctor, Ticket, Turn} from '../models';
import {DoctorRepository} from './doctor.repository';
import {TicketRepository} from './ticket.repository';
import {TurnRepository} from './turn.repository';

export class ConsultationRepository extends DefaultCrudRepository<
  Consultation,
  typeof Consultation.prototype.id,
  ConsultationRelations
> {

  public readonly doctor: BelongsToAccessor<Doctor, typeof Consultation.prototype.id>;

  public readonly ticket: BelongsToAccessor<Ticket, typeof Consultation.prototype.id>;

  public readonly turn: BelongsToAccessor<Turn, typeof Consultation.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('DoctorRepository') protected doctorRepositoryGetter: Getter<DoctorRepository>, @repository.getter('TicketRepository') protected ticketRepositoryGetter: Getter<TicketRepository>, @repository.getter('TurnRepository') protected turnRepositoryGetter: Getter<TurnRepository>,
  ) {
    super(Consultation, dataSource);
    this.turn = this.createBelongsToAccessorFor('turn', turnRepositoryGetter,);
    this.registerInclusionResolver('turn', this.turn.inclusionResolver);
    this.ticket = this.createBelongsToAccessorFor('ticket', ticketRepositoryGetter,);
    this.registerInclusionResolver('ticket', this.ticket.inclusionResolver);
    this.doctor = this.createBelongsToAccessorFor('doctor', doctorRepositoryGetter,);
    this.registerInclusionResolver('doctor', this.doctor.inclusionResolver);
  }
}
