import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Box} from './box.model';
import {User} from './user.model';
import {Consultation} from './consultation.model';
import {Payment} from './payment.model';

@model()
export class Turn extends Entity {
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
  startDate: string;

  @property({
    type: 'date',
  })
  endDate?: string;

  @property({
    type: 'number',
    required: true,
  })
  startBalance: number;

  @property({
    type: 'number',
    default: 0,
  })
  endBalance?: number;

  @belongsTo(() => Box)
  boxId: string;

  @belongsTo(() => User)
  userId: string;

  @hasMany(() => Consultation)
  consultation: Consultation[];

  @hasMany(() => Payment)
  payments: Payment[];

  constructor(data?: Partial<Turn>) {
    super(data);
  }
}

export interface TurnRelations {
  // describe navigational properties here
}

export type TurnWithRelations = Turn & TurnRelations;
