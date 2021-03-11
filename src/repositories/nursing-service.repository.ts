import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {NursingService, NursingServiceRelations} from '../models';

export class NursingServiceRepository extends DefaultCrudRepository<
  NursingService,
  typeof NursingService.prototype.id,
  NursingServiceRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(NursingService, dataSource);
  }
}
