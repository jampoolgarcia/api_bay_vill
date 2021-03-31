import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Consultation} from '../models';
import {ConsultationRepository, DoctorRepository} from '../repositories';

export class ConsultationService {

  constructor(
    @repository(ConsultationRepository)
    public consultationRepo: ConsultationRepository,
    @repository(DoctorRepository)
    public doctorRepo: DoctorRepository) {

  }

  async add(consultation: Omit<Consultation, 'id'>): Promise<boolean> {

    let isReady = false;

    let doctor = await this.doctorRepo.findById(consultation.doctorId);
    if (!doctor) throw new HttpErrors[404]("El doctor no existe.");
    doctor.balance += consultation.commission;
    await Promise.all(
      [
        this.doctorRepo.updateById(doctor.id, doctor),
        this.consultationRepo.create(consultation)
      ]
    ).then(res => {
      isReady = true;
    }).catch(err => {
      console.log(err);
      isReady = false;
    })

    return isReady;
  }

}
