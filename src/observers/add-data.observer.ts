import {
  Application,
  CoreBindings,
  inject,
  lifeCycleObserver,
  LifeCycleObserver
} from '@loopback/core';
import {repository} from '@loopback/repository';
import {Box, ConfigTestLab, User} from '../models';
import {PaymentTypes} from '../models/payment-types.model';
import {BoxRepository, ConfigTestLabRepository, PaymentTypesRepository, UserRepository} from '../repositories';
import {EncryptDecrypt} from '../services/encrypt-decrypt.service';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('AddDataGroup')
export class AddDataObserver implements LifeCycleObserver {

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
    @repository('UserRepository') private userRepo: UserRepository,
    @repository('BoxRepository') private boxRepo: BoxRepository,
    @repository('ConfigTestLabRepository') private configTestRepo: ConfigTestLabRepository,
    @repository('PaymentTypesRepository') private paymentTypesRepo: PaymentTypesRepository,
  ) { }


  /**
   * This method will be invoked when the application initializes. It will be
   * called at most once for a given application instance.
   */
  async init(): Promise<void> {
    // Add your logic for init

  }

  /**
   * This method will be invoked when the application starts.
   */
  async start(): Promise<void> {
    // Add your logic for start

    let countUser = (await this.userRepo.count()).count;
    if (countUser === 0) await this.createDefaultUser();

    let countBox = (await this.boxRepo.count()).count;
    if (countBox === 0) await this.createBox();

    let countConfig = (await this.configTestRepo.count()).count;
    if (countConfig === 0) await this.createDefaultConfigTest();

    let countPaymentTypes = (await this.paymentTypesRepo.count()).count;
    if (countPaymentTypes === 0) await this.createPaymentTypes();

  }

  /**
   * This method will be invoked when the application stops.
   */
  async stop(): Promise<void> {
    // Add your logic for stop

  }


  async createDefaultUser() {
    let user: User = new User({
      firstName: "default",
      lastName: "admin",
      userName: "admin",
      password: new EncryptDecrypt().Encrypt("admin"),
      role: 2,
      isActive: true,
      questions: [1, 2],
      replies: ["admin", "admin"]
    });

    await this.userRepo.create(user);
  }

  async createBox() {
    let box = new Box({
      number: 1,
      balance: 0
    });

    await this.boxRepo.create(box);
  }

  async createDefaultConfigTest() {
    let config: ConfigTestLab = new ConfigTestLab({
      startTime: "09:00",
      endTime: "21:00",
      days: [1, 2, 3, 4, 5]
    });

    await this.configTestRepo.create(config);

  }

  async createPaymentTypes() {
    let paymentTypes: PaymentTypes[] = [
      new PaymentTypes({name: "Efectivo", isWithdrawals: true}),
      new PaymentTypes({name: "Transferecia", isWithdrawals: false}),
      new PaymentTypes({name: "Tarjeta", isWithdrawals: false}),
    ]

    paymentTypes.forEach(async (paymentType) => {
      await await this.paymentTypesRepo.create(paymentType);
    });
  }

}
