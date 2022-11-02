import { Prisma } from '@prisma/client';

import { RaffleCreateDto, RaffleFindManyDto, RaffleFindOneDto, RaffleDeleteDto, RaffleUpdateDto, RaffleDto, RaffleSearchDto } from './dtos';
import { RaffleStatus } from './raffle.enum';

import { IUser } from '@user/user.interface';
import { IRaffleOption } from '@raffle_option/raffleOption.interface';
import { IPaymentOption } from '@payment_option/paymentOption.interface';

import { RaffleOptionCreateDto } from '@raffle_option/dtos';

export interface IRafflePaymentOption {
  id: string;
  userId: string;
  raffleId: string;
  paymentOptionId: string;

  paymentOption: IPaymentOption;
}

export interface IRaffle {
  id: string;
  numericId: number;

  ownerId: string;
  title: string;
  description: string;
  prize: string;
  remindMe: boolean;
  status: RaffleStatus;

  price: Prisma.Decimal;
  fundingTarget: Prisma.Decimal;
  optionsQty: number;

  createdAt: Date;
  updatedAt: Date;

  finishedAt: Date | null;
  prizeDrawAt: Date | null;
  startParticipationDt: Date | null;
  limitParticipationDt: Date | null;

  owner?: IUser | null;
  paymentOptions?: Array<IRafflePaymentOption>;
  options?: Array<IRaffleOption>;
}

export interface IRaffleService {
  createOne(item: RaffleCreateDto): Promise<RaffleDto>;
  createParticipation(item: RaffleOptionCreateDto): Promise<void>;
  findOne(item: RaffleFindOneDto): Promise<RaffleDto>;
  search(searchParameters: RaffleFindManyDto): Promise<Array<RaffleSearchDto>>;
  findMany(searchParameters: RaffleFindManyDto): Promise<Array<RaffleDto>>;
  updateOne(item: RaffleUpdateDto): Promise<void>;
  delete(item: RaffleDeleteDto): Promise<void>;
  count(searchParameters: RaffleFindManyDto): Promise<number>;
}

export interface IRaffleRepository {
  create(item: RaffleCreateDto): Promise<IRaffle>;
  find(searchParameters: RaffleFindManyDto): Promise<Array<IRaffle>>;
  search(searchParameters: RaffleFindManyDto): Promise<Array<Partial<IRaffle>>>;
  findOne(id: IRaffle['id']): Promise<IRaffle | null>;
  update(id: string, item: RaffleUpdateDto): Promise<void>;
  delete(idList: Array<string>): Promise<void>;
  count(searchParameters: RaffleFindManyDto): Promise<number>;
}
