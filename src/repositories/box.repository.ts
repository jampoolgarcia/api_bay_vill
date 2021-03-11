import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Box, BoxRelations, Turn} from '../models';
import {TurnRepository} from './turn.repository';

export class BoxRepository extends DefaultCrudRepository<
  Box,
  typeof Box.prototype.id,
  BoxRelations
> {

  public readonly turn: HasManyRepositoryFactory<Turn, typeof Box.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('TurnRepository') protected turnRepositoryGetter: Getter<TurnRepository>,
  ) {
    super(Box, dataSource);
    this.turn = this.createHasManyRepositoryFactoryFor('turn', turnRepositoryGetter,);
    this.registerInclusionResolver('turn', this.turn.inclusionResolver);
  }
}
