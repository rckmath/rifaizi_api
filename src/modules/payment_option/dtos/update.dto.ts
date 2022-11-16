import { InvalidFieldException, MissingFieldException } from '@shared/errors';
import { isValidUUID } from '@shared/utils';
import { PaymentOptionType, PaymentOptionSubType } from '../paymentOption.enum';

export default class PaymentOptionUpdateDto {
  constructor(
    public readonly id: string,
    public readonly ownerId?: string,
    public readonly alias?: string,
    public readonly key?: string,
    public readonly fullName?: string,
    public readonly type?: PaymentOptionType,
    public readonly subType?: PaymentOptionSubType,
    public readonly isDefault?: boolean
  ) {}

  static from(body: Partial<PaymentOptionUpdateDto>) {
    if (!body.id) throw new MissingFieldException('id');
    if (body.id && !isValidUUID(body.id)) throw new InvalidFieldException('id', body.id);
    if (body.ownerId && !isValidUUID(body.ownerId)) throw new InvalidFieldException('ownerId', body.ownerId);

    return new PaymentOptionUpdateDto(body.id, body.ownerId, body.alias, body.key, body.fullName, body.type, body.subType, body.isDefault);
  }
}
