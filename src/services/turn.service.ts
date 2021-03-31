
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Turn, User} from '../models';
import {BoxRepository, TurnRepository} from '../repositories';

export class TurnService {

  constructor(
    @repository(TurnRepository)
    public turnRepo: TurnRepository,
    @repository(BoxRepository)
    public boxRepo: BoxRepository,
  ) { }


  async openTurn(user: User, tk: string) {

    let box = await this.boxRepo.findOne({where: {"number": 1}});

    if (!box || box === undefined || box.balance === undefined || box.id === undefined || user.id === undefined)
      throw new HttpErrors[404]("Ha ocurrido un error al obtener la caja.");

    let turn = {
      startDate: new Date().toString(),
      startBalance: box.balance,
      boxId: box.id,
      userId: user.id,
      token: tk
    }

    return await this.turnRepo.create(turn);
  }

  async thereCurrentShift(user: User) {
    let turn = await this.turnRepo.findOne({
      "order": ["startDate DESC"],
      "limit": 1
    })


    if (turn) {
      if (turn.token.length > 1) {
        if (turn.userId != user.id) {
          throw new HttpErrors[403](`El turno del usuario anterior, debe cerrarse antes de continuar.`);
        }
        return turn;
      }
    }

    return false;
  }

  async closeTurn(turn: Turn): Promise<void> {

    let box = await this.boxRepo.findById(turn.boxId);


    if (!box)
      throw new HttpErrors[404]("Ha ocurrido un error al obtener la caja.");


    turn.endBalance = box.balance;
    turn.endDate = new Date().toString();
    turn.token = '';

    return await this.turnRepo.updateById(turn.id, turn);
  }


}
