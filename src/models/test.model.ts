import {Entity, model, property} from '@loopback/repository';

@model()
export class Test extends Entity {
  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  questions: string[];

  @property({
    type: 'array',
    itemType: 'number',
    required: true,
  })
  replies: number[];


  constructor(data?: Partial<Test>) {
    super(data);
  }
}

export interface TestRelations {
  // describe navigational properties here
}

export type TestWithRelations = Test & TestRelations;
