import {Entity, model, property, belongsTo} from '@loopback/repository';
import {Medicine} from './medicine.model';
import {Ticket} from './ticket.model';

@model()
export class Product extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
  })
  cost: number;

  @property({
    type: 'number',
    required: true,
  })
  quantity: number;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @belongsTo(() => Medicine)
  medicineId: string;

  @belongsTo(() => Ticket)
  ticketId: string;

  constructor(data?: Partial<Product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = Product & ProductRelations;
