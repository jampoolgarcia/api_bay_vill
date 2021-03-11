import {Entity, model, property, hasMany} from '@loopback/repository';
import {Payment} from './payment.model';

@model()
export class PaymentTypes extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'boolean',
    required: true,
    default: false,
  })
  isWithdrawals: boolean;

  @property({
    type: 'string',
  })
  payId?: string;

  @hasMany(() => Payment)
  payment: Payment[];

  constructor(data?: Partial<PaymentTypes>) {
    super(data);
  }
}

export interface PaymentTypesRelations {
  // describe navigational properties here
}

export type PaymentTypesWithRelations = PaymentTypes & PaymentTypesRelations;
