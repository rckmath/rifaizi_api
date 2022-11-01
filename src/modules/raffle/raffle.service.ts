import { inject, injectable } from 'inversify';

import { TYPES } from '@shared/ioc/types.ioc';
import { NotFoundException } from '@shared/errors';

import { IRaffle, IRaffleRepository, IRaffleService } from './raffle.interface';
import { RaffleCreateDto, RaffleDeleteDto, RaffleDto, RaffleFindManyDto, RaffleFindOneDto, RaffleUpdateDto } from './dtos';

import { RaffleStatus } from './raffle.enum';
import { UserRoleType } from '@user/user.enum';

import { IRaffleOption, IRaffleOptionRepository } from '@raffle_option/raffleOption.interface';
import { RaffleOptionCreateDto, RaffleOptionUpdateDto } from '@raffle_option/dtos';
import { RaffleOptionIndicator } from '@raffle_option/raffleOption.enum';

@injectable()
export class RaffleService implements IRaffleService {
  constructor(
    @inject(TYPES.IRaffleRepository) private readonly _repository: IRaffleRepository,
    @inject(TYPES.IRaffleOptionRepository) private readonly _raffleOptionRepository: IRaffleOptionRepository
  ) {}

  setNewStatusData(newStatus: RaffleStatus, foundRaffle: IRaffle, raffleUpdate: RaffleUpdateDto): void {
    switch (foundRaffle.status) {
      case RaffleStatus.CREATED:
        if (newStatus === RaffleStatus.IN_PROGRESS) {
          raffleUpdate.startParticipationDt = foundRaffle.startParticipationDt || new Date();
        }
        break;
      case RaffleStatus.IN_PROGRESS:
        if (newStatus === RaffleStatus.TO_DRAW) {
          raffleUpdate.limitParticipationDt = foundRaffle.limitParticipationDt || new Date();
        }
        break;
      case RaffleStatus.TO_DRAW:
        if (newStatus === RaffleStatus.DRAWN) {
          raffleUpdate.prizeDrawAt = foundRaffle.prizeDrawAt || new Date();
        }
        break;
      case RaffleStatus.DRAWN:
        break;
      case RaffleStatus.DELIVERED:
        break;
      case RaffleStatus.CANCELED:
        break;

      default:
        break;
    }

    if ([RaffleStatus.DELIVERED, RaffleStatus.CANCELED].includes(newStatus)) {
      raffleUpdate.finishedAt = foundRaffle.finishedAt || new Date();
    }
  }

  generateOptions(raffle: RaffleCreateDto | RaffleUpdateDto): void {
    if (!raffle.optionsQty || raffle.options?.length) return;

    const options: Array<RaffleOptionCreateDto> = [];

    for (let index = 1; index <= raffle.optionsQty; index++) {
      options.push(
        RaffleOptionCreateDto.from({
          alias: '',
          num: index,
          status: RaffleOptionIndicator.AVAILABLE,
        })
      );
    }

    raffle.options = options;
  }

  async persistParticipation(foundOption: IRaffleOption, option: RaffleOptionUpdateDto): Promise<void> {
    if (foundOption.status === RaffleOptionIndicator.AVAILABLE) option.status = RaffleOptionIndicator.RESERVED;
    if (option.status && foundOption.status !== option.status) option.statusChangedAt = new Date();
    await this._raffleOptionRepository.update(foundOption.id, option);
  }

  async createOne(raffle: RaffleCreateDto): Promise<RaffleDto> {
    this.generateOptions(raffle);
    const response = await this._repository.create(raffle);
    return this.findOne({ id: response.id });
  }

  async createParticipation(option: RaffleOptionUpdateDto): Promise<void> {
    const foundOptions = await this._raffleOptionRepository.findByRaffle(option.raffleId as string, option.num);

    console.log(option, foundOptions, Array.isArray(foundOptions));

    if (!foundOptions) throw new NotFoundException('RaffleOption');

    if (Array.isArray(foundOptions)) {
      for (const foundOption of foundOptions) {
        await this.persistParticipation(foundOption, option);
      }
    } else {
      await this.persistParticipation(foundOptions, option);
    }
  }

  async findOne(raffle: RaffleFindOneDto): Promise<RaffleDto> {
    const foundRaffle = await this._repository.findOne(raffle.id as string);
    if (!foundRaffle) throw new NotFoundException('Raffle');
    const reqAuthData = raffle.reqAuthData;
    if (reqAuthData && reqAuthData.role === UserRoleType.ADMIN) return RaffleDto.fromAdmin(foundRaffle);
    return RaffleDto.from(foundRaffle, reqAuthData?.userId);
  }

  async findMany(searchParameters: RaffleFindManyDto): Promise<Array<RaffleDto>> {
    let removeSensitiveData = true;
    const reqAuthData = searchParameters.reqAuthData;
    if (reqAuthData && reqAuthData.role === UserRoleType.ADMIN) removeSensitiveData = false;
    const foundRaffles = await this._repository.find(searchParameters);
    return RaffleDto.fromMany(foundRaffles, removeSensitiveData, reqAuthData?.userId);
  }

  async count(searchParameters: RaffleFindManyDto): Promise<number> {
    return this._repository.count(searchParameters);
  }

  async updateOne(raffle: RaffleUpdateDto): Promise<void> {
    const foundRaffle = await this._repository.findOne(raffle.id as string);
    if (!foundRaffle) throw new NotFoundException('Raffle');
    if (!foundRaffle.options?.length) this.generateOptions(raffle);
    if (raffle.status && raffle.status !== foundRaffle.status) this.setNewStatusData(raffle.status, foundRaffle, raffle);
    return this._repository.update(raffle.id, raffle);
  }

  async delete(raffle: RaffleDeleteDto): Promise<void> {
    const idList = raffle.id as Array<string>;
    let raffleList = [];
    raffleList = await Promise.all(idList.map(async (id) => this._repository.findOne(id)));
    if (raffleList.length) await this._repository.delete(idList);
  }
}
