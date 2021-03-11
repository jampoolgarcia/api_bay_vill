import {Entity, model, property} from '@loopback/repository';

@model()
export class ConfigTestLab extends Entity {
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
  startTime: string;

  @property({
    type: 'string',
    required: true,
  })
  endTime: string;

  @property({
    type: 'array',
    itemType: 'number',
    required: true,
  })
  days: number[];


  constructor(data?: Partial<ConfigTestLab>) {
    super(data);
  }
}

export interface ConfigTestLabRelations {
  // describe navigational properties here
}

export type ConfigTestLabWithRelations = ConfigTestLab & ConfigTestLabRelations;
