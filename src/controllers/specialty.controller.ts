import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param,


  patch, post,




  put,

  requestBody
} from '@loopback/rest';
import {Specialty} from '../models';
import {SpecialtyRepository} from '../repositories';

@authenticate("UserTokenStrategy", "AdminTokenStrategy")
export class SpecialtyController {
  constructor(
    @repository(SpecialtyRepository)
    public specialtyRepository: SpecialtyRepository,
  ) { }

  @post('/specialty', {
    responses: {
      '200': {
        description: 'Specialty model instance',
        content: {'application/json': {schema: getModelSchemaRef(Specialty)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Specialty, {
            title: 'NewSpecialty',
            exclude: ['id'],
          }),
        },
      },
    })
    specialty: Omit<Specialty, 'id'>,
  ): Promise<Specialty> {
    return this.specialtyRepository.create(specialty);
  }

  @get('/specialty/count', {
    responses: {
      '200': {
        description: 'Specialty model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Specialty) where?: Where<Specialty>,
  ): Promise<Count> {
    return this.specialtyRepository.count(where);
  }

  @get('/specialty', {
    responses: {
      '200': {
        description: 'Array of Specialty model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Specialty, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Specialty) filter?: Filter<Specialty>,
  ): Promise<Specialty[]> {
    return this.specialtyRepository.find(filter);
  }

  @patch('/specialty', {
    responses: {
      '200': {
        description: 'Specialty PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Specialty, {partial: true}),
        },
      },
    })
    specialty: Specialty,
    @param.where(Specialty) where?: Where<Specialty>,
  ): Promise<Count> {
    return this.specialtyRepository.updateAll(specialty, where);
  }

  @get('/specialty/{id}', {
    responses: {
      '200': {
        description: 'Specialty model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Specialty, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Specialty, {exclude: 'where'}) filter?: FilterExcludingWhere<Specialty>
  ): Promise<Specialty> {
    return this.specialtyRepository.findById(id, filter);
  }

  @patch('/specialty/{id}', {
    responses: {
      '204': {
        description: 'Specialty PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Specialty, {partial: true}),
        },
      },
    })
    specialty: Specialty,
  ): Promise<void> {
    await this.specialtyRepository.updateById(id, specialty);
  }

  @put('/specialty/{id}', {
    responses: {
      '204': {
        description: 'Specialty PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() specialty: Specialty,
  ): Promise<void> {
    await this.specialtyRepository.replaceById(id, specialty);
  }

  @del('/specialty/{id}', {
    responses: {
      '204': {
        description: 'Specialty DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.specialtyRepository.deleteById(id);
  }
}
