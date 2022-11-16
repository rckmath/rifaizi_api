import { InvalidFieldException } from '@shared/errors';
import { BaseFindManyDto } from '@http/dto';
import { arraySplitter, isValidUUID, stringToNumber } from '@shared/utils';
import { IAuth } from '@user/user.interface';
import { PaymentOptionType, PaymentOptionSubType } from '../paymentOption.enum';

export default class PaymentOptionFindManyDto extends BaseFindManyDto {
  constructor(
    page?: number,
    pageSize?: number,
    orderBy?: string,
    orderDescending?: boolean,
    fromDate?: Date,
    toDate?: Date,
    reqAuthData?: IAuth,
    public paginate: boolean = true,
    public includeDetails: boolean = false,
    public readonly alias?: string,
    public readonly key?: string,
    public readonly fullName?: string,
    public id?: string | Array<string>,
    public ownerId?: string | Array<string>,
    public type?: PaymentOptionType | Array<PaymentOptionType>,
    public subType?: PaymentOptionSubType | Array<PaymentOptionSubType>
  ) {
    super(page, pageSize, orderBy, orderDescending, fromDate, toDate, reqAuthData);
  }

  static from(body: Partial<PaymentOptionFindManyDto>) {
    body.id = arraySplitter<string>(body.id);
    body.ownerId = arraySplitter<string>(body.ownerId);
    body.type = arraySplitter<PaymentOptionType>(body.type);
    body.subType = arraySplitter<PaymentOptionSubType>(body.subType);
    body.page = stringToNumber(body.page, false, 1, 'page');
    body.pageSize = stringToNumber(body.pageSize, false, 1, 'pageSize');
    body.orderDescending = body.orderDescending && typeof body.orderDescending == 'string' && JSON.parse(body.orderDescending);
    body.includeDetails = body.includeDetails && typeof body.includeDetails == 'string' && JSON.parse(body.includeDetails);
    body.paginate = body.paginate && typeof body.paginate == 'string' && JSON.parse(body.paginate);

    body.id.forEach((x) => {
      if (!isValidUUID(x)) throw new InvalidFieldException('id', x);
    });

    body.ownerId.forEach((x) => {
      if (!isValidUUID(x)) throw new InvalidFieldException('id', x);
    });

    body.fromDate = body.fromDate && new Date(body.fromDate);
    body.toDate = body.toDate && new Date(body.toDate);

    return new PaymentOptionFindManyDto(
      body.page,
      body.pageSize,
      body.orderBy,
      body.orderDescending,
      body.fromDate,
      body.toDate,
      body.reqAuthData,
      body.paginate,
      body.includeDetails,
      body.alias,
      body.key,
      body.fullName,
      body.id,
      body.ownerId,
      body.type,
      body.subType
    );
  }
}
