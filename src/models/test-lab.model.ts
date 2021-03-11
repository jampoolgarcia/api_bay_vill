import {Entity, model, property} from '@loopback/repository';

@model()
export class TestLab extends Entity {
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
    required: true,
  })
  price: number;

  @property({
    type: 'number',
    required: true,
  })
  specialPrice: number;


  constructor(data?: Partial<TestLab>) {
    super(data);
  }
}

export interface TestLabRelations {
  // describe navigational properties here
}

export type TestLabWithRelations = TestLab & TestLabRelations;
