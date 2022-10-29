import { injectable } from 'inversify';

import { db as _db } from '@database/index';

import { IRaffleOptionRepository, IRaffleOption } from './raffleOption.interface';
import { RaffleOptionFindManyDto, RaffleOptionUpdateDto } from './dtos';

@injectable()
export class RaffleOptionRepository implements IRaffleOptionRepository {
  async update(id: string, item: RaffleOptionUpdateDto): Promise<void> {
    await _db.raffleOptionNumber.update({
      where: { id },
      data: {
        ownerId: item.ownerId,
        alias: item.alias,
        status: item.status,
        statusChangedAt: item.statusChangedAt,
      },
    });
  }

  async delete(idList: Array<string>): Promise<void> {
    await _db.raffleOptionNumber.deleteMany({ where: { id: { in: idList } } });
  }

  async findByRaffle(raffleId: string, num?: number): Promise<Array<IRaffleOption> | IRaffleOption | null> {
    let options;

    if (num) {
      options = await _db.raffleOptionNumber.findFirst({
        where: { raffleId, num: { equals: num ? num : undefined } },
      });
    } else {
      options = await _db.raffleOptionNumber.findMany({ where: { raffleId } });
    }

    return options;
  }

  async find(searchParameters: RaffleOptionFindManyDto): Promise<Array<IRaffleOption>> {
    const raffles = await _db.raffleOptionNumber.findMany({
      skip: searchParameters.paginate ? searchParameters.skip : undefined,
      take: searchParameters.paginate ? searchParameters.pageSize : undefined,
      orderBy: {
        [`${searchParameters.orderBy}`]: searchParameters.orderDescending ? 'desc' : 'asc',
      },
      where: {
        alias: { search: searchParameters.alias },
        num: { equals: searchParameters.num ? searchParameters.num : undefined },
        raffleId: { in: searchParameters.raffleId?.length ? searchParameters.raffleId : undefined },
        ownerId: { in: searchParameters.ownerId?.length ? searchParameters.ownerId : undefined },
        status: { in: searchParameters.status?.length ? searchParameters.status : undefined },
        createdAt: { gte: searchParameters.fromDate, lte: searchParameters.toDate },
      },
      ...(searchParameters.includeDetails && { include: { owner: true } }),
    });

    return raffles;
  }

  async count(searchParameters: RaffleOptionFindManyDto): Promise<number> {
    const raffleCount = await _db.raffleOptionNumber.count({
      orderBy: {
        [`${searchParameters.orderBy}`]: searchParameters.orderDescending ? 'desc' : 'asc',
      },
      where: {
        alias: { search: searchParameters.alias },
        id: { in: searchParameters.id?.length ? searchParameters.id : undefined },
        ownerId: { in: searchParameters.ownerId?.length ? searchParameters.ownerId : undefined },
        status: { in: searchParameters.status?.length ? searchParameters.status : undefined },
        createdAt: {
          gte: searchParameters.fromDate,
          lte: searchParameters.toDate,
        },
      },
    });

    return raffleCount;
  }

  async findOne(id: string): Promise<IRaffleOption | null> {
    return _db.raffleOptionNumber.findUnique({ where: { id }, include: { owner: true } });
  }
}
