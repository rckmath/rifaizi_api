import { RaffleStatus } from '../raffle.enum';
import { IRaffle } from '../raffle.interface';

export default class RaffleSearchDto {
  constructor(
    public readonly id?: string,
    public readonly numericId?: number,
    public readonly ownerId?: string,
    public readonly title?: string,
    public readonly description?: string,
    public readonly prize?: string,
    public readonly remindMe?: boolean,
    public readonly status?: RaffleStatus,
    public readonly price?: number,
    public readonly fundingTarget?: number,
    public readonly optionsQty?: number,
    public readonly finishedAt?: Date | null,
    public readonly prizeDrawAt?: Date | null,
    public readonly startParticipationDt?: Date | null,
    public readonly limitParticipationDt?: Date | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

  static from(raffle: Partial<IRaffle>) {
    return new RaffleSearchDto(
      raffle.id,
      raffle.numericId,
      raffle.ownerId,
      raffle.title,
      raffle.description,
      raffle.prize,
      raffle.remindMe,
      raffle.status,
      raffle.price ? raffle.price.toNumber() : raffle.price,
      raffle.fundingTarget ? raffle.fundingTarget.toNumber() : raffle.fundingTarget,
      raffle.optionsQty,
      raffle.finishedAt,
      raffle.prizeDrawAt,
      raffle.startParticipationDt,
      raffle.limitParticipationDt,
      raffle.createdAt,
      raffle.updatedAt
    );
  }

  static fromMany(raffles: Array<Partial<IRaffle>>) {
    return raffles.map((raffle) => RaffleSearchDto.from(raffle));
  }
}
