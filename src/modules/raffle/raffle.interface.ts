import { IUser } from '@user/user.interface';
import { Prisma } from '@prisma/client';
import { RaffleCreateDto, RaffleFindManyDto, RaffleFindOneDto, RaffleDeleteDto, RaffleUpdateDto, RaffleDto } from './dtos';
import { RaffleStatus } from './raffle.enum';

export interface IRaffle {
  id: string;
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
}

export interface IRaffleService {
  createOne(item: RaffleCreateDto): Promise<RaffleDto>;
  findOne(item: RaffleFindOneDto): Promise<RaffleDto>;
  findMany(searchParameters: RaffleFindManyDto): Promise<Array<RaffleDto>>;
  updateOne(item: RaffleUpdateDto): Promise<void>;
  delete(item: RaffleDeleteDto): Promise<void>;
  count(searchParameters: RaffleFindManyDto): Promise<number>;
}

export interface IRaffleRepository {
  create(item: RaffleCreateDto): Promise<IRaffle>;
  find(searchParameters: RaffleFindManyDto): Promise<Array<IRaffle>>;
  findOne(id: IRaffle['id']): Promise<IRaffle | null>;
  update(id: string, item: RaffleUpdateDto): Promise<void>;
  delete(idList: Array<string>): Promise<void>;
  count(searchParameters: RaffleFindManyDto): Promise<number>;
}
