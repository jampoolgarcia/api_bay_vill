import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Patient} from './patient.model';
import {Consultation} from './consultation.model';
import {BillPayment} from './bill-payment.model';

@model()
export class Ticket extends Entity {
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
    type: 'boolean',
    required: true,
  })
  status: boolean;

  @belongsTo(() => Patient)
  patientId: string;

  @hasMany(() => Consultation)
  consultation: Consultation[];

  @hasMany(() => BillPayment)
  billPayment: BillPayment[];

  constructor(data?: Partial<Ticket>) {
    super(data);
  }
}

export interface TicketRelations {
  // describe navigational properties here
}

export type TicketWithRelations = Ticket & TicketRelations;
