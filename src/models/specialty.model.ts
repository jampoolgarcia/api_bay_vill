import {Entity, model, property, hasMany} from '@loopback/repository';
import {Doctor} from './doctor.model';

@model()
export class Specialty extends Entity {
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

  @hasMany(() => Doctor)
  doctor: Doctor[];

  constructor(data?: Partial<Specialty>) {
    super(data);
  }
}

export interface SpecialtyRelations {
  // describe navigational properties here
}

export type SpecialtyWithRelations = Specialty & SpecialtyRelations;
