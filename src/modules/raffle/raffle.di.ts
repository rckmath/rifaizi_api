import { ContainerModule } from 'inversify';

import { TYPES } from '@shared/ioc/types.ioc';

import { RaffleService } from './raffle.service';
import { RaffleRepository } from './raffle.repository';
import { IRaffleRepository, IRaffleService } from './raffle.interface';

export class RaffleDI extends ContainerModule {
  public constructor() {
    super((bind) => {
      bind<IRaffleService>(TYPES.IRaffleService).to(RaffleService);
      bind<IRaffleRepository>(TYPES.IRaffleRepository).to(RaffleRepository);
    });
  }
}
