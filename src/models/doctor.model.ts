import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Consultation} from './consultation.model';
import {Specialty} from './specialty.model';
import {Payment} from './payment.model';

@model()
export class Doctor extends Entity {
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
  balance: number;

  @property({
    type: 'string',
    default: "user_icon.svg",
  })
  img?: string;

  @belongsTo(() => Specialty)
  specialtyId: string;

  @hasMany(() => Consultation)
  consultation: Consultation[];

  @hasMany(() => Payment)
  payments: Payment[];

  constructor(data?: Partial<Doctor>) {
    super(data);
  }
}

export interface DoctorRelations {
  // describe navigational properties here
}

export type DoctorWithRelations = Doctor & DoctorRelations;
