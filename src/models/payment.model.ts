import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Doctor} from './doctor.model';
import {Nurse} from './nurse.model';
import {PaymentTypes} from './payment-types.model';
import {Turn} from './turn.model';

@model()
export class Payment extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(() => Turn)
  turnId: string;

  @belongsTo(() => PaymentTypes)
  paymentTypesId: string;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'number',
    required: true,
  })
  paid: number;

  @belongsTo(() => Doctor)
  doctorId?: string;

  @belongsTo(() => Nurse)
  nurseId?: string;



  constructor(data?: Partial<Payment>) {
    super(data);
  }
}

export interface PaymentRelations {
  // describe navigational properties here
}

export type PaymentWithRelations = Payment & PaymentRelations;
