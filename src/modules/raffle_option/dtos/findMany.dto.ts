import { InvalidFieldException } from '@shared/errors';
import { BaseFindManyDto } from '@http/dto';
import { arraySplitter, isValidUUID, stringToNumber } from '@shared/utils';
import { IAuth } from '@user/user.interface';
import { RaffleOptionIndicator } from '../raffleOption.enum';

export default class RaffleOptionFindManyDto extends BaseFindManyDto {
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
    public readonly title?: string,
    public id?: string | Array<string>,
    public raffleId?: string | Array<string>,
    public ownerId?: string | Array<string>,
    public num?: number,
    public alias?: string,
    public ownerPhone?: string,
    public status?: RaffleOptionIndicator | Array<RaffleOptionIndicator>
  ) {
    super(page, pageSize, orderBy, orderDescending, fromDate, toDate, reqAuthData);
  }

  static from(body: Partial<RaffleOptionFindManyDto>) {
    body.id = arraySplitter<string>(body.id);
    body.ownerId = arraySplitter<string>(body.ownerId);
    body.raffleId = arraySplitter<string>(body.raffleId);
    body.status = arraySplitter<RaffleOptionIndicator>(body.status);
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

    return new RaffleOptionFindManyDto(
      body.page,
      body.pageSize,
      body.orderBy,
      body.orderDescending,
      body.fromDate,
      body.toDate,
      body.reqAuthData,
      body.paginate,
      body.includeDetails,
      body.title,
      body.id,
      body.raffleId,
      body.ownerId,
      body.num,
      body.alias,
      body.ownerPhone,
      body.status
    );
  }
}
