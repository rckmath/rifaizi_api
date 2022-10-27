import { inject, injectable } from 'inversify';

import { IPaymentOptionRepository, IPaymentOptionService } from './paymentOption.interface';
import {
  PaymentOptionCreateDto,
  PaymentOptionDeleteDto,
  PaymentOptionDto,
  PaymentOptionFindManyDto,
  PaymentOptionFindOneDto,
  PaymentOptionUpdateDto,
} from './dtos';

import { TYPES } from '@shared/ioc/types.ioc';
import { NotFoundException } from '@shared/errors';
import { UserRoleType } from '@user/user.enum';

@injectable()
export class PaymentOptionService implements IPaymentOptionService {
  constructor(@inject(TYPES.IPaymentOptionRepository) private readonly _repository: IPaymentOptionRepository) {}

  async createOne(paymentOption: PaymentOptionCreateDto): Promise<PaymentOptionDto> {
    const response = await this._repository.create(paymentOption);
    return this.findOne({ id: response.id });
  }

  async findOne(paymentOption: PaymentOptionFindOneDto): Promise<PaymentOptionDto> {
    const foundPaymentOption = await this._repository.findOne(paymentOption.id as string);
    if (!foundPaymentOption) throw new NotFoundException('PaymentOption');
    const reqAuthData = paymentOption.reqAuthData;
    if (reqAuthData && reqAuthData.role === UserRoleType.ADMIN) return PaymentOptionDto.fromAdmin(foundPaymentOption);
    return PaymentOptionDto.from(foundPaymentOption, reqAuthData?.userId);
  }

  async findMany(searchParameters: PaymentOptionFindManyDto): Promise<Array<PaymentOptionDto>> {
    let removeSensitiveData = true;
    const reqAuthData = searchParameters.reqAuthData;
    if (reqAuthData && reqAuthData.role === UserRoleType.ADMIN) removeSensitiveData = false;
    const foundPaymentOptions = await this._repository.find(searchParameters);
    return PaymentOptionDto.fromMany(foundPaymentOptions, removeSensitiveData, reqAuthData?.userId);
  }

  async count(searchParameters: PaymentOptionFindManyDto): Promise<number> {
    return this._repository.count(searchParameters);
  }

  async updateOne(paymentOption: PaymentOptionUpdateDto): Promise<void> {
    const foundPaymentOption = await this._repository.findOne(paymentOption.id as string);
    if (!foundPaymentOption) throw new NotFoundException('PaymentOption');
    return this._repository.update(paymentOption.id, paymentOption);
  }

  async delete(paymentOption: PaymentOptionDeleteDto): Promise<void> {
    const idList = paymentOption.id as Array<string>;
    let paymentOptionList = [];
    paymentOptionList = await Promise.all(idList.map(async (id) => this._repository.findOne(id)));
    if (paymentOptionList.length) await this._repository.delete(idList);
  }
}
