import {Entity, model, property, hasMany} from '@loopback/repository';
import {Payment} from './payment.model';

@model()
export class Nurse extends Entity {
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
    type: 'string',
    required: true,
  })
  ci: string;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;

  @property({
    type: 'string',
    required: true,
  })
  sex: string;

  @property({
    type: 'date',
    required: true,
  })
  dateBirth: string;

  @property({
    type: 'string',
    required: true,
  })
  direction: string;

  @property({
    type: 'number',
    default: 0,
  })
  balance?: number;

  @property({
    type: 'string',
    default: "user_icon.svg",
  })
  img?: string;

  @hasMany(() => Payment)
  payments: Payment[];

  constructor(data?: Partial<Nurse>) {
    super(data);
  }
}

export interface NurseRelations {
  // describe navigational properties here
}

export type NurseWithRelations = Nurse & NurseRelations;
