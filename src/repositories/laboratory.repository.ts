import {DefaultCrudRepository} from '@loopback/repository';
import {Laboratory, LaboratoryRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class LaboratoryRepository extends DefaultCrudRepository<
  Laboratory,
  typeof Laboratory.prototype.id,
  LaboratoryRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(Laboratory, dataSource);
  }
}
