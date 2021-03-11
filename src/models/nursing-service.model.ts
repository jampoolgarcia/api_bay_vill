import {Entity, model, property} from '@loopback/repository';

@model()
export class NursingService extends Entity {
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
  date: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'string',
    required: true,
  })
  observation: string;

  @property({
    type: 'number',
    required: true,
  })
  commission: number;


  constructor(data?: Partial<NursingService>) {
    super(data);
  }
}

export interface NursingServiceRelations {
  // describe navigational properties here
}

export type NursingServiceWithRelations = NursingService & NursingServiceRelations;
