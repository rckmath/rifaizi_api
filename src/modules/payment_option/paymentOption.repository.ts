import { injectable } from 'inversify';

import { db as _db } from '@database/index';

import { IPaymentOptionRepository, IPaymentOption } from './paymentOption.interface';
import { PaymentOptionCreateDto, PaymentOptionFindManyDto, PaymentOptionUpdateDto } from './dtos';

@injectable()
export class PaymentOptionRepository implements IPaymentOptionRepository {
  async create(item: PaymentOptionCreateDto): Promise<IPaymentOption> {
    const paymentOption = await _db.paymentOption.create({
      data: {
        ownerId: item.ownerId,
        fullName: item.fullName,
        alias: item.alias,
        key: item.key,
        type: item.type,
        subType: item.subType,
        default: item.isDefault,
      },
    });

    return paymentOption;
  }

  async update(id: string, item: PaymentOptionUpdateDto): Promise<void> {
    await _db.paymentOption.update({
      where: { id },
      data: {
        ownerId: item.ownerId,
        fullName: item.fullName,
        alias: item.alias,
        key: item.key,
        type: item.type,
        subType: item.subType,
        default: item.isDefault,
      },
    });
  }

  async removeDefault(userId: string): Promise<void> {
    const foundPaymentOption = await _db.paymentOption.findFirst({
      where: { default: true, ownerId: userId },
      select: { id: true, default: true },
    });

    if (foundPaymentOption) {
      await _db.paymentOption.update({
        where: { id: foundPaymentOption.id },
        data: { default: false },
      });
    }
  }

  async delete(idList: Array<string>): Promise<void> {
    await _db.paymentOption.deleteMany({ where: { id: { in: idList } } });
  }

  async find(searchParameters: PaymentOptionFindManyDto): Promise<Array<IPaymentOption>> {
    const paymentOptions = await _db.paymentOption.findMany({
      skip: searchParameters.paginate ? searchParameters.skip : undefined,
      take: searchParameters.paginate ? searchParameters.pageSize : undefined,
      orderBy: {
        [`${searchParameters.orderBy}`]: searchParameters.orderDescending ? 'desc' : 'asc',
      },
      where: {
        id: { in: searchParameters.id?.length ? searchParameters.id : undefined },
        ownerId: { in: searchParameters.ownerId?.length ? searchParameters.ownerId : undefined },
        fullName: { search: searchParameters.fullName },
        alias: { search: searchParameters.alias },
        key: { search: searchParameters.key },
        type: { in: searchParameters.type?.length ? searchParameters.type : undefined },
        subType: { in: searchParameters.subType?.length ? searchParameters.subType : undefined },
        createdAt: { gte: searchParameters.fromDate, lte: searchParameters.toDate },
      },
      ...(searchParameters.includeDetails && { include: { owner: true } }),
    });

    return paymentOptions;
  }

  async count(searchParameters: PaymentOptionFindManyDto): Promise<number> {
    const paymentOptionCount = await _db.paymentOption.count({
      orderBy: {
        [`${searchParameters.orderBy}`]: searchParameters.orderDescending ? 'desc' : 'asc',
      },
      where: {
        id: { in: searchParameters.id?.length ? searchParameters.id : undefined },
        ownerId: { in: searchParameters.ownerId?.length ? searchParameters.ownerId : undefined },
        fullName: { search: searchParameters.fullName },
        alias: { search: searchParameters.alias },
        key: { search: searchParameters.key },
        type: { in: searchParameters.type?.length ? searchParameters.type : undefined },
        subType: { in: searchParameters.subType?.length ? searchParameters.subType : undefined },
        createdAt: { gte: searchParameters.fromDate, lte: searchParameters.toDate },
      },
    });

    return paymentOptionCount;
  }

  async findOne(id: string): Promise<IPaymentOption | null> {
    return _db.paymentOption.findUnique({
      where: { id },
      include: { owner: true },
    });
  }
}
