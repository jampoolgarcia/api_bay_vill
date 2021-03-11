// Uncomment these imports to begin using these cool features!

import {Filter, repository} from '@loopback/repository';
import {get, getModelSchemaRef, param, post, put, requestBody} from '@loopback/rest';
import {ConfigTestLab} from '../models';
import {ConfigTestLabRepository} from '../repositories';
import {ConfigTestLabService} from '../services/configTestLab.service';

// import {inject} from '@loopback/core';


export class ConfigTestLabController {

  configTestLabService: ConfigTestLabService;

  constructor(
    @repository(ConfigTestLabRepository)
    public ConfigTestLabRepository: ConfigTestLabRepository,
  ) {
    this.configTestLabService = new ConfigTestLabService(this.ConfigTestLabRepository);
  }

  // crea un objeto de tipo ConfigTestLab y lo guarda en la base de datos
  @post('/config-test-lab', {
    responses: {
      '200': {
        description: 'configTestLab model instance',
        content: {'application/json': {schema: getModelSchemaRef(ConfigTestLab)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ConfigTestLab, {
            title: 'NewConfigTestLab',
            exclude: ['id'],
          }),
        },
      },
    })
    ConfigTestLab: Omit<ConfigTestLab, 'id'>,
  ): Promise<ConfigTestLab> {
    return this.ConfigTestLabRepository.create(ConfigTestLab);
  }


  @put('/config-test-lab/{id}', {
    responses: {
      '204': {
        description: 'config-test-lab PUT success',
        content: {'application/json': {schema: getModelSchemaRef(ConfigTestLab)}},
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ConfigTestLab, {
            title: 'UpdateConfigTestLab',
            exclude: ['id'],
          }),
        },
      },
    })
    configTestLab: Omit<ConfigTestLab, 'id'>,
  ): Promise<void> {
    await this.ConfigTestLabRepository.replaceById(id, configTestLab);
  }

  // obtiene el precio dependiendo de la configuracion
  @get('/config-test-lab/price', {
    responses: {
      '200': {
        description: 'config-test-lab model price',
        content: {'application/json': {schema: String}},
      },
    },
  })
  async price(): Promise<String> {
    return this.configTestLabService.getPrice();
  }



  @get('/config-test-lab', {
    responses: {
      '200': {
        description: 'Array of ConfigTestLab model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(ConfigTestLab, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(ConfigTestLab) filter?: Filter<ConfigTestLab>,
  ): Promise<ConfigTestLab[]> {
    return this.ConfigTestLabRepository.find(filter);
  }

}
