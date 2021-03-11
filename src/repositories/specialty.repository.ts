import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {Specialty, SpecialtyRelations, Doctor} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import {DoctorRepository} from './doctor.repository';

export class SpecialtyRepository extends DefaultCrudRepository<
  Specialty,
  typeof Specialty.prototype.id,
  SpecialtyRelations
> {

  public readonly doctor: HasManyRepositoryFactory<Doctor, typeof Specialty.prototype.id>;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource, @repository.getter('DoctorRepository') protected doctorRepositoryGetter: Getter<DoctorRepository>,
  ) {
    super(Specialty, dataSource);
    this.doctor = this.createHasManyRepositoryFactoryFor('doctor', doctorRepositoryGetter,);
    this.registerInclusionResolver('doctor', this.doctor.inclusionResolver);
  }
}
