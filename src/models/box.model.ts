import {Entity, hasMany, model, property} from '@loopback/repository';
import {Turn} from './turn.model';

@model()
export class Box extends Entity {
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
  number: number;

  @property({
    type: 'number',
    required: true,
    default: 0,
  })
  balance: number;

  @hasMany(() => Turn)
  turn: Turn[];

  constructor(data?: Partial<Box>) {
    super(data);
  }
}

export interface BoxRelations {
  // describe navigational properties here
}

export type BoxWithRelations = Box & BoxRelations;
