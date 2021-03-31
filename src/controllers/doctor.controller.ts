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
import {BoxRepository, DoctorRepository, PaymentRepository, TurnRepository} from '../repositories';
import {PaymentService} from '../services/payment.service';

export class DoctorController {

  paymentService: PaymentService;

  constructor(
    @repository(DoctorRepository)
    public doctorRepository: DoctorRepository,
    @repository(TurnRepository)
    public turnRepo: TurnRepository,
    @repository(BoxRepository)
    public boxRepo: BoxRepository,
    @repository(PaymentRepository)
    public payRepo: PaymentRepository,
  ) {
    this.paymentService = new PaymentService(
      turnRepo, boxRepo, payRepo
    );
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

  @get('/doctor/{id}/details', {
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
  async findByIdDetails(
    @param.path.string('id') id: string,
    @param.filter(Doctor, {exclude: 'where'}) filter?: FilterExcludingWhere<Doctor>
  ): Promise<Doctor> {
    console.log(filter);
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
      responses: {
        '200': {
          description: 'Process'
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
            exclude: ['id', 'nurseId', 'doctorId'],
          }),
        },
      },
    })
    payment: Omit<Payment, 'id' | 'nurseId'>,
  ): Promise<boolean> {
    payment.doctorId = id;
    return this.paymentService.addPaymentEntity(id, payment, this.doctorRepository);

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
