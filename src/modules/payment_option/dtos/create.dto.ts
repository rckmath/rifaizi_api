import { MissingFieldException } from '@shared/errors';
import { PaymentOptionType, PaymentOptionSubType } from '../paymentOption.enum';

export default class PaymentOptionCreateDto {
  constructor(
    public readonly ownerId: string,
    public readonly alias: string,
    public readonly key: string,
    public readonly fullName: string,
    public readonly type: PaymentOptionType = PaymentOptionType.PIX,
    public readonly subType: PaymentOptionSubType = PaymentOptionSubType.CPF_CNPJ,
    public readonly isDefault: boolean = false
  ) {}

  static from(body: Partial<PaymentOptionCreateDto>) {
    if (!body.ownerId) throw new MissingFieldException('ownerId');
    if (!body.alias) throw new MissingFieldException('alias');
    if (!body.key) throw new MissingFieldException('key');
    if (!body.fullName) throw new MissingFieldException('fullName');

    return new PaymentOptionCreateDto(body.ownerId, body.alias, body.key, body.fullName, body.type, body.subType, body.isDefault);
  }
}
