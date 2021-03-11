import {DefaultCrudRepository} from '@loopback/repository';
import {ConfigTestLab, ConfigTestLabRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ConfigTestLabRepository extends DefaultCrudRepository<
  ConfigTestLab,
  typeof ConfigTestLab.prototype.id,
  ConfigTestLabRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(ConfigTestLab, dataSource);
  }
}
