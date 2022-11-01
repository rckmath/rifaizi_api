import { MissingFieldException } from '@shared/errors';
import { RaffleOptionIndicator } from '../raffleOption.enum';

export default class RaffleOptionCreateDto {
  constructor(
    public readonly num: number,
    public alias: string,
    public readonly status: RaffleOptionIndicator = RaffleOptionIndicator.AVAILABLE
  ) {}

  static from(body: Partial<RaffleOptionCreateDto>) {
    if (!body.alias) body.alias = '';
    if (!body.num) throw new MissingFieldException('num');
    if (!body.status) throw new MissingFieldException('status');
    return new RaffleOptionCreateDto(body.num, body.alias, body.status);
  }
}
