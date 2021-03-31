import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Doctor} from './doctor.model';
import {Ticket} from './ticket.model';
import {Turn} from './turn.model';

@model({settings: {strict: false}})
export class Consultation extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'string',
    required: true,
  })
  observation: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'number',
    required: true,
  })
  commission: number;

  @belongsTo(() => Doctor)
  doctorId: string;

  @belongsTo(() => Ticket)
  ticketId?: string;

  @belongsTo(() => Turn)
  turnId: string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Consultation>) {
    super(data);
  }
}

export interface ConsultationRelations {
  // describe navigational properties here
}

export type ConsultationWithRelations = Consultation & ConsultationRelations;
