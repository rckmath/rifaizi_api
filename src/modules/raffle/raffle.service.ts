import { inject, injectable } from 'inversify';

import { IRaffleRepository, IRaffleService } from './raffle.interface';
import { RaffleCreateDto, RaffleDeleteDto, RaffleDto, RaffleFindManyDto, RaffleFindOneDto, RaffleUpdateDto } from './dtos';

import { TYPES } from '@shared/ioc/types.ioc';
import { NotFoundException } from '@shared/errors';
import { UserRoleType } from '@modules/user/user.enum';

@injectable()
export class RaffleService implements IRaffleService {
  constructor(@inject(TYPES.IRaffleRepository) private readonly _repository: IRaffleRepository) {}

  async createOne(raffle: RaffleCreateDto): Promise<RaffleDto> {
    const response = await this._repository.create(raffle);
    return this.findOne({ id: response.id });
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
    const foundRaffles = await this._repository.find(searchParameters);
    const reqAuthData = searchParameters.reqAuthData;
    if (reqAuthData && reqAuthData.role === UserRoleType.ADMIN) removeSensitiveData = false;
    return RaffleDto.fromMany(foundRaffles, removeSensitiveData, reqAuthData?.userId);
  }

  async count(searchParameters: RaffleFindManyDto): Promise<number> {
    return this._repository.count(searchParameters);
  }

  async updateOne(raffle: RaffleUpdateDto): Promise<void> {
    await this.findOne({ id: raffle.id });
    return this._repository.update(raffle.id, raffle);
  }

  async delete(raffle: RaffleDeleteDto): Promise<void> {
    const idList = raffle.id as Array<string>;
    let raffleList = [];
    raffleList = await Promise.all(idList.map(async (id) => this._repository.findOne(id)));
    if (raffleList.length) await this._repository.delete(idList);
  }
}
