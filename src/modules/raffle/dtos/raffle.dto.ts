import { UserDto } from '@user/dtos';
import { RaffleStatus } from '../raffle.enum';
import { IRaffle } from '../raffle.interface';

export default class RaffleDto {
  constructor(
    public readonly id: string,
    public readonly ownerId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly prize: string,
    public readonly remindMe: boolean,
    public readonly status: RaffleStatus,
    public readonly price: number,
    public readonly fundingTarget: number,
    public readonly optionsQty: number,
    public readonly finishedAt: Date | null,
    public readonly prizeDrawAt: Date | null,
    public readonly startParticipationDt: Date | null,
    public readonly limitParticipationDt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt?: Date,
    public readonly owner?: UserDto | null,
    public readonly ownerName?: string | null
  ) {}

  static from(raffle: IRaffle, reqUserId?: string) {
    const owner = raffle.owner ? UserDto.from(raffle.owner) : null;
    const ownerName = owner?.name;

    return new RaffleDto(
      raffle.id,
      raffle.ownerId,
      raffle.title,
      raffle.description,
      raffle.prize,
      raffle.remindMe,
      raffle.status,
      raffle.price.toNumber(),
      raffle.fundingTarget.toNumber(),
      raffle.optionsQty,
      raffle.finishedAt,
      raffle.prizeDrawAt,
      raffle.startParticipationDt,
      raffle.limitParticipationDt,
      raffle.createdAt,
      raffle.updatedAt,
      reqUserId === owner?.id ? owner : null,
      ownerName
    );
  }

  static fromAdmin(raffle: IRaffle) {
    const owner = raffle.owner ? UserDto.from(raffle.owner) : null;
    const ownerName = owner?.name;

    return new RaffleDto(
      raffle.id,
      raffle.ownerId,
      raffle.title,
      raffle.description,
      raffle.prize,
      raffle.remindMe,
      raffle.status,
      raffle.price.toNumber(),
      raffle.fundingTarget.toNumber(),
      raffle.optionsQty,
      raffle.finishedAt,
      raffle.prizeDrawAt,
      raffle.startParticipationDt,
      raffle.limitParticipationDt,
      raffle.createdAt,
      raffle.updatedAt,
      owner,
      ownerName
    );
  }

  static fromMany(raffles: Array<IRaffle>, removeSensitiveData?: boolean, reqUserId?: string) {
    return raffles.map((raffle) => (removeSensitiveData ? RaffleDto.from(raffle, reqUserId) : RaffleDto.fromAdmin(raffle)));
  }
}
