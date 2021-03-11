import {Entity, model, property, hasMany} from '@loopback/repository';
import {Ticket} from './ticket.model';

@model()
export class Patient extends Entity {
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
    type: 'string',
  })
  groudS?: string;

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

  @hasMany(() => Ticket)
  ticket: Ticket[];

  constructor(data?: Partial<Patient>) {
    super(data);
  }
}

export interface PatientRelations {
  // describe navigational properties here
}

export type PatientWithRelations = Patient & PatientRelations;
