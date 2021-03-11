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
import {Doctor, Payment} from '../models';
import {DoctorRepository} from '../repositories';
import {PaymentService} from '../services/payment.service';

export class DoctorController {

  paymentService: PaymentService;

  constructor(
    @repository(DoctorRepository)
    public doctorRepository: DoctorRepository,
  ) {
    this.paymentService = new PaymentService();
  }

  @post('/doctor', {
    responses: {
      '200': {
        description: 'Doctor model instance',
        content: {'application/json': {schema: getModelSchemaRef(Doctor)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Doctor, {
            title: 'NewDoctor',
            exclude: ['id'],
          }),
        },
      },
    })
    doctor: Omit<Doctor, 'id'>,
  ): Promise<Doctor> {
    return this.doctorRepository.create(doctor);
  }

  @get('/doctor/count', {
    responses: {
      '200': {
        description: 'Doctor model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Doctor) where?: Where<Doctor>,
  ): Promise<Count> {
    return this.doctorRepository.count(where);
  }

  @get('/doctor', {
    responses: {
      '200': {
        description: 'Array of Doctor model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Doctor, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Doctor) filter?: Filter<Doctor>,
  ): Promise<Doctor[]> {
    return this.doctorRepository.find(filter);
  }

  @patch('/doctor', {
    responses: {
      '200': {
        description: 'Doctor PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Doctor, {partial: true}),
        },
      },
    })
    doctor: Doctor,
    @param.where(Doctor) where?: Where<Doctor>,
  ): Promise<Count> {
    return this.doctorRepository.updateAll(doctor, where);
  }

  @get('/doctor/{id}', {
    responses: {
      '200': {
        description: 'Doctor model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Doctor, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Doctor, {exclude: 'where'}) filter?: FilterExcludingWhere<Doctor>
  ): Promise<Doctor> {
    return this.doctorRepository.findById(id, filter);
  }

  @patch('/doctor/{id}', {
    responses: {
      '204': {
        description: 'Doctor PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Doctor, {partial: true}),
        },
      },
    })
    doctor: Doctor,
  ): Promise<void> {
    await this.doctorRepository.updateById(id, doctor);
  }


  @post('/doctor/{id}/pay', {
    responses: {
      '200': {
        description: 'payment model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Payment,
              {
                title: 'New DoctorPay',
                exclude: ['id', 'nurseId'],
              })
          }
        },
      },
    },
  })
  async addPay(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payment, {
            //title: 'New Pay',
            exclude: ['id', 'nurseId'],
          }),
        },
      },
    })
    payment: Omit<Payment, 'id' | 'nurseId'>,
  ): Promise<Doctor | unknown> {

    return (<Doctor | unknown>this.paymentService.addPaymentEntity(id, payment, this.doctorRepository));

  }


  @put('/doctor/{id}', {
    responses: {
      '204': {
        description: 'Doctor PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() doctor: Doctor,
  ): Promise<void> {
    await this.doctorRepository.replaceById(id, doctor);
  }

  @del('/doctor/{id}', {
    responses: {
      '204': {
        description: 'Doctor DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.doctorRepository.deleteById(id);
  }
}
