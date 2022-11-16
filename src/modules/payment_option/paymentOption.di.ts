import { ContainerModule } from 'inversify';

import { TYPES } from '@shared/ioc/types.ioc';

import { PaymentOptionService } from './paymentOption.service';
import { PaymentOptionRepository } from './paymentOption.repository';
import { IPaymentOptionRepository, IPaymentOptionService } from './paymentOption.interface';

export class PaymentOptionDI extends ContainerModule {
  public constructor() {
    super((bind) => {
      bind<IPaymentOptionService>(TYPES.IPaymentOptionService).to(PaymentOptionService);
      bind<IPaymentOptionRepository>(TYPES.IPaymentOptionRepository).to(PaymentOptionRepository);
    });
  }
}
