import { InvalidFieldException, MissingFieldException } from '@shared/errors';
import { isValidUUID } from '@shared/utils';
import { RaffleOptionIndicator } from '../raffleOption.enum';

export default class RaffleOptionUpdateDto {
  constructor(
    public readonly id?: string,
    public readonly ownerId?: string,
    public readonly raffleId?: string,
    public num?: number,
    public readonly alias?: string,
    public status?: RaffleOptionIndicator,
    public statusChangedAt?: Date
  ) {}

  static from(body: Partial<RaffleOptionUpdateDto>) {
    if (body.id && !isValidUUID(body.id)) throw new InvalidFieldException('id', body.id);
    if (body.ownerId && !isValidUUID(body.ownerId)) throw new InvalidFieldException('ownerId', body.ownerId);
    if (body.raffleId && !isValidUUID(body.raffleId)) throw new InvalidFieldException('raffleId', body.raffleId);
    if (!body.num) throw new MissingFieldException('num');
    if (body.num) body.num = parseInt(body.num as unknown as string, 10);

    return new RaffleOptionUpdateDto(body.id, body.ownerId, body.raffleId, body.num, body.alias, body.status, body.statusChangedAt);
  }
}
