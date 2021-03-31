import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Payment} from '../models';
import {BoxRepository, DoctorRepository, NurseRepository, PaymentRepository, TurnRepository} from '../repositories';

export class PaymentService {


  constructor(
    @repository(TurnRepository)
    public turnRepo: TurnRepository,
    @repository(BoxRepository)
    public boxRepo: BoxRepository,
    @repository(PaymentRepository)
    public payRepo: PaymentRepository,
  ) {

  }

  async addPaymentEntity(id: string, payment: Payment, repository: DoctorRepository | NurseRepository): Promise<boolean> {

    let isProcess = false;

    let turn = await this.turnRepo.findById(payment.turnId);

    if (!turn)
      throw new HttpErrors[404]("Ha ocurrido un error al obtener el turno.");

    let box = await this.boxRepo.findById(turn.boxId);

    if (!box)
      throw new HttpErrors[500]("Ha ocurrido un error al obtener la caja registradora.");

    let entity = await repository.findById(id);

    if (!entity)
      throw new HttpErrors[500]("Ha ocurrido un error al obtener la entidad.");

    if (entity.balance == undefined)
      throw new HttpErrors[500]("Ha ocurrido un error al obtener el balance.");

    if (entity.balance < payment.paid)
      throw new HttpErrors[404]("La entidad no posee el balance suficiente.");

    if (box.balance < payment.paid)
      throw new HttpErrors[404]("No existe un saldo suficiente para realizar el pago.");

    box.balance -= payment.paid;
    entity.balance -= payment.paid;

    await Promise.all([
      this.boxRepo.updateById(box.id, box),
      repository.updateById(entity.id, entity),
      this.payRepo.create(payment)
    ]).then(res => {
      isProcess = true;
    })

    return isProcess;

  }


}
