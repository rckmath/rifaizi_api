import { IUser } from '@user/user.interface';
import { IRaffle } from '@raffle/raffle.interface';
import {
  PaymentOptionCreateDto,
  PaymentOptionFindManyDto,
  PaymentOptionFindOneDto,
  PaymentOptionDeleteDto,
  PaymentOptionUpdateDto,
  PaymentOptionDto,
} from './dtos';
import { PaymentOptionSubType, PaymentOptionType } from './paymentOption.enum';

export interface IPaymentOption {
  id: string;
  ownerId: string;

  alias: string;
  key: string;
  fullName: string;
  type: PaymentOptionType;
  subType: PaymentOptionSubType | null;
  default: boolean;

  createdAt: Date;
  updatedAt: Date;

  raffles?: Array<IRaffle>;
  owner?: IUser | null;
}

export interface IPaymentOptionService {
  createOne(item: PaymentOptionCreateDto): Promise<PaymentOptionDto>;
  findOne(item: PaymentOptionFindOneDto): Promise<PaymentOptionDto>;
  findMany(searchParameters: PaymentOptionFindManyDto): Promise<Array<PaymentOptionDto>>;
  updateOne(item: PaymentOptionUpdateDto): Promise<void>;
  delete(item: PaymentOptionDeleteDto): Promise<void>;
  count(searchParameters: PaymentOptionFindManyDto): Promise<number>;
}

export interface IPaymentOptionRepository {
  create(item: PaymentOptionCreateDto): Promise<IPaymentOption>;
  find(searchParameters: PaymentOptionFindManyDto): Promise<Array<IPaymentOption>>;
  findOne(id: IPaymentOption['id']): Promise<IPaymentOption | null>;
  update(id: string, item: PaymentOptionUpdateDto): Promise<void>;
  delete(idList: Array<string>): Promise<void>;
  count(searchParameters: PaymentOptionFindManyDto): Promise<number>;
}
