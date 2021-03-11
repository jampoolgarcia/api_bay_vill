import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Ticket} from './ticket.model';

@model()
export class BillPayment extends Entity {
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
  type: string;

  @property({
    type: 'number',
    required: true,
  })
  paid: number;

  @belongsTo(() => Ticket)
  ticketId: string;

  constructor(data?: Partial<BillPayment>) {
    super(data);
  }
}

export interface BillPaymentRelations {
  // describe navigational properties here
}

export type BillPaymentWithRelations = BillPayment & BillPaymentRelations;
