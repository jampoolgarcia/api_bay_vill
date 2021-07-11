import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Category} from './category.model';
import {Product} from './product.model';

@model()
export class Medicine extends Entity {
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
  description: string;

  @property({
    type: 'number',
    required: true,
    default: 0,
  })
  price: string;

  @property({
    type: 'number',
    required: true,
  })
  min: number;

  @property({
    type: 'number',
    default: 0,
  })
  quantity?: number;

  @belongsTo(() => Category)
  categoryId: string;

  @hasMany(() => Product)
  product: Product[];

  constructor(data?: Partial<Medicine>) {
    super(data);
  }
}

export interface MedicineRelations {
  // describe navigational properties here
}

export type MedicineWithRelations = Medicine & MedicineRelations;
