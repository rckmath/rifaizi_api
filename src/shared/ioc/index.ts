import { Container } from 'inversify';
import { PrismaService } from '@database/prisma';

import { UserDI } from '@user/user.di';
import { RaffleDI } from '@raffle/raffle.di';
import { PaymentOptionDI } from '@payment_option/paymentOption.di';
import { RaffleOptionDI } from '@modules/raffle_option/raffleOption.di';

const container = new Container({ skipBaseClassChecks: true });

container.bind(PrismaService).toSelf();
container.load(new UserDI());
container.load(new RaffleDI());
container.load(new PaymentOptionDI());
container.load(new RaffleOptionDI());

export { container };
