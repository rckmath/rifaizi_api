import { ContainerModule } from 'inversify';

import { TYPES } from '@shared/ioc/types.ioc';

import { RaffleOptionRepository } from './raffleOption.repository';
import { IRaffleOptionRepository } from './raffleOption.interface';

export class RaffleOptionDI extends ContainerModule {
  public constructor() {
    super((bind) => {
      bind<IRaffleOptionRepository>(TYPES.IRaffleOptionRepository).to(RaffleOptionRepository);
    });
  }
}
