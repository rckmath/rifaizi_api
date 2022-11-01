import { UserDto } from '@user/dtos';

import { RaffleOptionIndicator } from '../raffleOption.enum';
import { IRaffleOption } from '../raffleOption.interface';

export default class RaffleOptionDto {
  constructor(
    public readonly id: string,
    public readonly ownerId: string | null,
    public readonly raffleId: string,
    public readonly num: number,
    public readonly alias: string,
    public readonly status: RaffleOptionIndicator,
    public readonly statusChangedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt?: Date,
    public readonly owner?: UserDto | null,
    public readonly ownerName?: string | null,
    public readonly ownerPhone?: string | null
  ) {}

  static from(option: IRaffleOption, reqUserId?: string) {
    const owner = option.owner ? UserDto.from(option.owner) : null;
    const ownerName = owner?.name || option.ownerName;
    const ownerPhone = owner?.phone || option.ownerPhone;

    return new RaffleOptionDto(
      option.id,
      option.ownerId,
      option.raffleId,
      option.num,
      option.alias,
      option.status,
      option.statusChangedAt,
      option.createdAt,
      option.updatedAt,
      reqUserId === owner?.id ? owner : null,
      ownerName,
      ownerPhone
    );
  }

  static fromAdmin(option: IRaffleOption) {
    const owner = option.owner ? UserDto.from(option.owner) : null;
    const ownerName = owner?.name || option.ownerName;
    const ownerPhone = owner?.phone || option.ownerPhone;

    return new RaffleOptionDto(
      option.id,
      option.ownerId,
      option.raffleId,
      option.num,
      option.alias,
      option.status,
      option.statusChangedAt,
      option.createdAt,
      option.updatedAt,
      owner,
      ownerName,
      ownerPhone
    );
  }

  static fromMany(options: Array<IRaffleOption>, removeSensitiveData?: boolean, reqUserId?: string) {
    return options.map((option) => (removeSensitiveData ? RaffleOptionDto.from(option, reqUserId) : RaffleOptionDto.fromAdmin(option)));
  }
}
