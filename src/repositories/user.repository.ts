import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Turn, User, UserRelations} from '../models';
import {TurnRepository} from './turn.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
  > {

  public readonly turn: HasManyRepositoryFactory<Turn, typeof User.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('TurnRepository') protected turnRepositoryGetter: Getter<TurnRepository>,
  ) {
    super(User, dataSource);
    this.turn = this.createHasManyRepositoryFactoryFor(
      'turn', turnRepositoryGetter,
    );
    this.registerInclusionResolver('turn', this.turn.inclusionResolver);
  }
}
