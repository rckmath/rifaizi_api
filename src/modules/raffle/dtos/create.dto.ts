import { MissingFieldException } from '@shared/errors';

import { RaffleOptionCreateDto } from '@raffle_option/dtos';
import { IPaymentOption } from '@payment_option/paymentOption.interface';

import { RaffleStatus } from '../raffle.enum';

export default class RaffleCreateDto {
  constructor(
    public readonly ownerId: string,
    public readonly title: string,
    public description: string,
    public readonly prize: string,
    public readonly remindMe: boolean = false,
    public readonly status: RaffleStatus = RaffleStatus.CREATED,
    public readonly price: number,
    public readonly fundingTarget: number,
    public optionsQty: number,
    public readonly finishedAt?: Date,
    public readonly prizeDrawAt?: Date,
    public startParticipationDt?: Date,
    public readonly limitParticipationDt?: Date,
    public readonly paymentOptions?: Array<IPaymentOption>,
    public options?: Array<RaffleOptionCreateDto>
  ) {}

  static from(body: Partial<RaffleCreateDto>) {
    if (!body.ownerId) throw new MissingFieldException('ownerId');
    if (!body.title) throw new MissingFieldException('title');
    if (!body.prize) throw new MissingFieldException('prize');
    if (!body.price) throw new MissingFieldException('price');
    if (!body.fundingTarget) throw new MissingFieldException('fundingTarget');
    if (!body.optionsQty) throw new MissingFieldException('optionsQty');
    if (!body.description) body.description = '';
    if (body.optionsQty) body.optionsQty = parseInt(body.optionsQty as unknown as string, 10);

    return new RaffleCreateDto(
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
