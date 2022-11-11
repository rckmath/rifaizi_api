import { RaffleOptionFindManyDto, RaffleOptionUpdateDto } from './dtos';
import { RaffleOptionIndicator } from './raffleOption.enum';

import { IUser } from '@user/user.interface';
import { IRaffle } from '@raffle/raffle.interface';

export interface IRaffleOption {
  id: string;
  raffleId: string;

  ownerId: string | null;
  ownerName: string | null;
  ownerPhone: string | null;
  paymentVoucher: string | null;

  num: number;
  alias: string;
  status: RaffleOptionIndicator;

  statusChangedAt: Date | null;

  createdAt: Date;
  updatedAt: Date;

  owner?: IUser | null;
  raffle?: IRaffle | null;
}

export interface IRaffleOptionRepository {
  find(searchParameters: RaffleOptionFindManyDto): Promise<Array<IRaffleOption>>;
  findByRaffle(raffleId: string, num?: number | Array<number>): Promise<Array<IRaffleOption>>;
  findOne(id: IRaffleOption['id']): Promise<IRaffleOption | null>;
  update(id: string, item: RaffleOptionUpdateDto): Promise<void>;
  delete(idList: Array<string>): Promise<void>;
  count(searchParameters: RaffleOptionFindManyDto): Promise<number>;
}
