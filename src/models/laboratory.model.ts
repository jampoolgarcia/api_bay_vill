import {Entity, model, property} from '@loopback/repository';

@model()
export class Laboratory extends Entity {
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
    type: 'number',
    default: 0,
  })
  balance?: number;

  @property({
    type: 'string',
    required: true,
  })
  phone: string;


  constructor(data?: Partial<Laboratory>) {
    super(data);
  }
}

export interface LaboratoryRelations {
  // describe navigational properties here
}

export type LaboratoryWithRelations = Laboratory & LaboratoryRelations;
