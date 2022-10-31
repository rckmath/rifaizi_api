import { injectable } from 'inversify';

import { db as _db } from '@database/index';
import { Prisma } from '@prisma/client';

import { IRaffleRepository, IRaffle } from './raffle.interface';
import { RaffleCreateDto, RaffleFindManyDto, RaffleUpdateDto } from './dtos';
import { RaffleListingFilter } from './raffle.enum';

@injectable()
export class RaffleRepository implements IRaffleRepository {
  async create(item: RaffleCreateDto): Promise<IRaffle> {
    const raffle = await _db.raffle.create({
      data: {
        ownerId: item.ownerId,
        title: item.title,
        description: item.description,
        prize: item.prize,
        remindMe: item.remindMe,
        status: item.status,

        price: new Prisma.Decimal(item.price),
        fundingTarget: new Prisma.Decimal(item.fundingTarget),
        optionsQty: item.optionsQty,

        finishedAt: item.finishedAt,
        prizeDrawAt: item.prizeDrawAt,
        startParticipationDt: item.startParticipationDt,
        limitParticipationDt: item.limitParticipationDt,

        paymentOptions: item.paymentOptions?.length
          ? {
              createMany: {
                data: item.paymentOptions.map((paymentOption) => ({
                  userId: paymentOption.ownerId,
                  paymentOptionId: paymentOption.id,
                })),
              },
            }
          : undefined,

        options: item.options?.length ? { createMany: { data: item.options } } : undefined,
      },

      include: { paymentOptions: { include: { paymentOption: true } } },
    });

    return raffle;
  }

  async update(id: string, item: RaffleUpdateDto): Promise<void> {
    await _db.raffle.update({
      where: { id },
      data: {
        ownerId: item.ownerId,
        title: item.title,
        description: item.description,
        prize: item.prize,
        remindMe: item.remindMe,
        status: item.status,

        price: item.price ? new Prisma.Decimal(item.price) : undefined,
        fundingTarget: item.fundingTarget ? new Prisma.Decimal(item.fundingTarget) : undefined,
        optionsQty: item.optionsQty,

        finishedAt: item.finishedAt,
        prizeDrawAt: item.prizeDrawAt,
        startParticipationDt: item.startParticipationDt,
        limitParticipationDt: item.limitParticipationDt,

        paymentOptions: item.paymentOptions?.length
          ? {
              createMany: {
                data: item.paymentOptions.map((paymentOption) => ({
                  userId: paymentOption.ownerId,
                  paymentOptionId: paymentOption.id,
                })),
              },
            }
          : undefined,

        options: item.options?.length ? { createMany: { data: item.options } } : undefined,
      },
    });
  }

  async delete(idList: Array<string>): Promise<void> {
    await _db.raffle.deleteMany({ where: { id: { in: idList } } });
  }

  async find(searchParameters: RaffleFindManyDto): Promise<Array<IRaffle>> {
    const raffles = await _db.raffle.findMany({
      skip: searchParameters.paginate ? searchParameters.skip : undefined,
      take: searchParameters.paginate ? searchParameters.pageSize : undefined,
      orderBy: {
        [`${searchParameters.orderBy}`]: searchParameters.orderDescending ? 'desc' : 'asc',
      },
      where: {
        title: { search: searchParameters.title },
        id: { in: searchParameters.id?.length ? searchParameters.id : undefined },
        ownerId: {
          ...(searchParameters.listingFilter === RaffleListingFilter.MINE
            ? { in: searchParameters.ownerId?.length ? searchParameters.ownerId : undefined }
            : { notIn: searchParameters.ownerId?.length ? searchParameters.ownerId : undefined }),
        },

        ...(searchParameters.listingFilter === RaffleListingFilter.PARTICIPATING && {
          options: { some: { ownerId: { equals: searchParameters.ownerId as string } } },
        }),

        status: { in: searchParameters.status?.length ? searchParameters.status : undefined },
        createdAt: { gte: searchParameters.fromDate, lte: searchParameters.toDate },
      },
      ...(searchParameters.includeDetails && {
        include: {
          owner: true,
          paymentOptions: { include: { paymentOption: true } },
          options: { select: { ownerId: true } },
        },
      }),
    });

    return raffles;
  }

  async count(searchParameters: RaffleFindManyDto): Promise<number> {
    const raffleCount = await _db.raffle.findMany({
      orderBy: {
        [`${searchParameters.orderBy}`]: searchParameters.orderDescending ? 'desc' : 'asc',
      },
      where: {
        title: { search: searchParameters.title },
        id: { in: searchParameters.id?.length ? searchParameters.id : undefined },

        ownerId: {
          ...(searchParameters.listingFilter === RaffleListingFilter.MINE
            ? { in: searchParameters.ownerId?.length ? searchParameters.ownerId : undefined }
            : { notIn: searchParameters.ownerId?.length ? searchParameters.ownerId : undefined }),
        },

        ...(searchParameters.listingFilter === RaffleListingFilter.PARTICIPATING && {
          options: { some: { ownerId: { equals: searchParameters.ownerId as string } } },
        }),

        status: { in: searchParameters.status?.length ? searchParameters.status : undefined },
        createdAt: {
          gte: searchParameters.fromDate,
          lte: searchParameters.toDate,
        },
      },
      select: {
        title: true,
        id: true,
        ownerId: true,
        status: true,
        createdAt: true,
        ...(searchParameters.listingFilter === RaffleListingFilter.PARTICIPATING && { options: { select: { ownerId: true } } }),
      },
    });

    return raffleCount.length;
  }

  async findOne(id: string): Promise<IRaffle | null> {
    return _db.raffle.findUnique({
      where: { id },
      include: {
        owner: true,
        paymentOptions: { include: { paymentOption: true } },
        options: { orderBy: { num: 'asc' } },
      },
    });
  }
}
