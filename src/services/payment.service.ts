import {Doctor, Nurse, Payment} from '../models';
import {DoctorRepository, NurseRepository} from '../repositories';

export class PaymentService {


  constructor() {

  }

  async addPaymentEntity(id: string, payment: Payment, repository: DoctorRepository | NurseRepository): Promise<Doctor | Nurse> {

    let entity = await repository.findById(id, {
      include: [
        {
          relation: 'payments',
          scope: {
            include: [{relation: 'PaymentTypes'}],
          },
        },
      ],
    });
    // entity.paid = entity.paid ?? [];
    // entity.paid?.push(payment);

    // if (payment) {
    //   if (entity.balance !== null && entity.balance !== undefined) {
    //     if (payment.paid > entity.balance) throw new HttpErrors[400]("El pago supera el saldo existente");
    //   } else {
    //     throw new HttpErrors[400]("No existe la propiedad balance")
    //   }

    //   entity.balance -= payment.paid;
    // }
    // await repository.updateById(id, entity);
    return entity;
  }

}
