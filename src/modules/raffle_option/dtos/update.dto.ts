import { InvalidFieldException, MissingFieldException } from '@shared/errors';
import { isValidUUID } from '@shared/utils';
import { RaffleOptionIndicator } from '../raffleOption.enum';

export default class RaffleOptionUpdateDto {
  constructor(
    public readonly id?: string,
    public readonly raffleId?: string,
    public readonly ownerId?: string,
    public readonly ownerName?: string,
    public readonly ownerPhone?: string,
    public num?: number | Array<number>,
    public readonly alias?: string,
    public status?: RaffleOptionIndicator,
    public statusChangedAt?: Date
  ) {}

  static from(body: Partial<RaffleOptionUpdateDto>) {
    if (!body.num) throw new MissingFieldException('num');
    if (body.id && !isValidUUID(body.id)) throw new InvalidFieldException('id', body.id);
    if (body.raffleId && !isValidUUID(body.raffleId)) throw new InvalidFieldException('raffleId', body.raffleId);

    return new RaffleOptionUpdateDto(
      body.id,
      body.raffleId,
      body.ownerId,
      body.ownerName,
      body.ownerPhone,
      body.num,
      body.alias,
      body.status,
      body.statusChangedAt
    );
  }
}
