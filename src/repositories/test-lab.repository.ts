import {DefaultCrudRepository} from '@loopback/repository';
import {TestLab, TestLabRelations} from '../models';
import {DbDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class TestLabRepository extends DefaultCrudRepository<
  TestLab,
  typeof TestLab.prototype.id,
  TestLabRelations
> {
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
  ) {
    super(TestLab, dataSource);
  }
}
