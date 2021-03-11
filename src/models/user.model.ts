import {Entity, hasMany, model, property} from '@loopback/repository';
import {Turn} from './turn.model';

@model()
export class User extends Entity {
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
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true
    }
  })
  userName: string;

  @property({
    type: 'string',
    required: true,
    hidden: true,
  })
  password: string;

  @property({
    type: 'number',
    default: 1,
  })
  role: number;

  @property({
    type: 'boolean',
    default: false,
  })
  isActive: boolean;

  @property({
    type: 'array',
    itemType: 'number',
    required: true,
  })
  questions: number[];

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  replies: string[];

  @hasMany(() => Turn)
  turn: Turn[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
