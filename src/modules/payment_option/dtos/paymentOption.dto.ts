import { UserDto } from '@user/dtos';
import { PaymentOptionType, PaymentOptionSubType } from '../paymentOption.enum';
import { IPaymentOption } from '../paymentOption.interface';

export default class PaymentOptionDto {
  constructor(
    public readonly id: string,
    public readonly ownerId: string,
    public readonly alias: string,
    public readonly key: string,
    public readonly fullName: string,
    public readonly type: PaymentOptionType,
    public readonly isDefault: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt?: Date,
    public readonly subType?: PaymentOptionSubType | null,
    public readonly owner?: UserDto | null,
    public readonly ownerName?: string | null
  ) {}

  static from(paymentOption: IPaymentOption, reqUserId?: string) {
    const owner = paymentOption.owner ? UserDto.from(paymentOption.owner) : null;
    const ownerName = owner?.name;

    return new PaymentOptionDto(
      paymentOption.id,
      paymentOption.ownerId,
      paymentOption.alias,
      paymentOption.key,
      paymentOption.fullName,
      paymentOption.type,
      paymentOption.default,
      paymentOption.createdAt,
      paymentOption.updatedAt,
      paymentOption.subType,
      reqUserId === owner?.id ? owner : null,
      ownerName
    );
  }

  static fromAdmin(paymentOption: IPaymentOption) {
    const owner = paymentOption.owner ? UserDto.from(paymentOption.owner) : null;
    const ownerName = owner?.name;

    return new PaymentOptionDto(
      paymentOption.id,
      paymentOption.ownerId,
      paymentOption.alias,
      paymentOption.key,
      paymentOption.fullName,
      paymentOption.type,
      paymentOption.default,
      paymentOption.createdAt,
      paymentOption.updatedAt,
      paymentOption.subType,
      owner,
      ownerName
    );
  }

  static fromMany(paymentOptions: Array<IPaymentOption>, removeSensitiveData?: boolean, reqUserId?: string) {
    return paymentOptions.map((paymentOption) =>
      removeSensitiveData ? PaymentOptionDto.from(paymentOption, reqUserId) : PaymentOptionDto.fromAdmin(paymentOption)
    );
  }
}
