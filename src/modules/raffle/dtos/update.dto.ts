import { RaffleOptionCreateDto } from '@raffle_option/dtos';
import { IPaymentOption } from '@payment_option/paymentOption.interface';
import { InvalidFieldException, MissingFieldException } from '@shared/errors';
import { isValidUUID } from '@shared/utils';
import { RaffleStatus } from '../raffle.enum';

export default class RaffleUpdateDto {
  constructor(
    public readonly id: string,
    public readonly ownerId?: string,
    public readonly title?: string,
    public readonly description?: string,
    public readonly prize?: string,
    public readonly remindMe?: boolean,
    public readonly status?: RaffleStatus,
    public readonly price?: number,
    public readonly fundingTarget?: number,
    public optionsQty?: number,
    public finishedAt?: Date,
    public prizeDrawAt?: Date,
    public startParticipationDt?: Date,
    public limitParticipationDt?: Date,
    public paymentOptions?: Array<IPaymentOption>,
    public options?: Array<RaffleOptionCreateDto>
  ) {}

  static from(body: Partial<RaffleUpdateDto>) {
    if (!body.id) throw new MissingFieldException('id');
    if (body.id && !isValidUUID(body.id)) throw new InvalidFieldException('id', body.id);
    if (body.ownerId && !isValidUUID(body.ownerId)) throw new InvalidFieldException('ownerId', body.ownerId);
    if (body.optionsQty) body.optionsQty = parseInt(body.optionsQty as unknown as string, 10);

    return new RaffleUpdateDto(
      body.id,
      body.ownerId,
      body.title,
      body.description,
      body.prize,
      body.remindMe,
      body.status,
      body.price,
      body.fundingTarget,
      body.optionsQty,
      body.finishedAt,
      body.prizeDrawAt,
      body.startParticipationDt,
      body.limitParticipationDt,
      body.paymentOptions
    );
  }
}
