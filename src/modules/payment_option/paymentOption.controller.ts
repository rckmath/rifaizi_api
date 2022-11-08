import * as express from 'express';
import { inject } from 'inversify';
import {
  controller,
  httpPost,
  request,
  response,
  BaseHttpController,
  Controller,
  httpGet,
  httpDelete,
  httpPut,
} from 'inversify-express-utils';

import { TYPES } from '@shared/ioc/types.ioc';

import { IPaymentOptionService } from './paymentOption.interface';
import {
  PaymentOptionCreateDto,
  PaymentOptionFindOneDto,
  PaymentOptionDeleteDto,
  PaymentOptionFindManyDto,
  PaymentOptionDto,
  PaymentOptionUpdateDto,
} from './dtos';

import { BaseHttpResponse, Request, Validate } from '@http/api';
import { BasePaginationDto } from '@http/dto';
import AuthMiddleware from '@user/user.middleware';

@controller('/paymentOption')
export class PaymentOptionController extends BaseHttpController implements Controller {
  constructor(@inject(TYPES.IPaymentOptionService) private readonly _paymentOptionService: IPaymentOptionService) {
    super();
  }

  @httpPost('/', AuthMiddleware.validateToken(), Validate.with(PaymentOptionCreateDto))
  public async create(@request() req: Request, @response() res: express.Response) {
    const createdPaymentOption = await this._paymentOptionService.createOne(req.body);
    const response = BaseHttpResponse.success(createdPaymentOption);
    return res.json(response);
  }

  @httpGet('/', AuthMiddleware.validateToken(), Validate.withQuery(PaymentOptionFindManyDto))
  public async getWithPagination(@request() req: Request, @response() res: express.Response) {
    let response;

    const [paymentOptions, paymentOptionsCount] = await Promise.all([
      this._paymentOptionService.findMany(req.body),
      req.body.paginate ? this._paymentOptionService.count(req.body) : undefined,
    ]);

    response = req.body.paginate
      ? new BasePaginationDto<PaymentOptionDto>(paymentOptionsCount, parseInt(req.body.page), paymentOptions)
      : paymentOptions;
    response = BaseHttpResponse.success(response);

    return res.json(response);
  }

  @httpGet('/:id', AuthMiddleware.validateToken(), Validate.withParams(PaymentOptionFindOneDto))
  public async getById(@request() req: Request, @response() res: express.Response) {
    const paymentOption = await this._paymentOptionService.findOne(req.body);
    const response = BaseHttpResponse.success(paymentOption);
    return res.json(response);
  }

  @httpPut('/:id', AuthMiddleware.validateToken(), Validate.withParams(PaymentOptionUpdateDto))
  public async updateById(@request() req: Request, @response() res: express.Response) {
    const paymentOption = await this._paymentOptionService.updateOne(req.body, req.auth.userId);
    const response = BaseHttpResponse.success(paymentOption);
    return res.json(response);
  }

  @httpDelete('/:id', AuthMiddleware.validateToken(), Validate.withAll(PaymentOptionDeleteDto))
  public async deleteById(@request() req: Request, @response() res: express.Response) {
    const paymentOption = await this._paymentOptionService.delete(req.body);
    const response = BaseHttpResponse.success(paymentOption);
    return res.json(response);
  }
}
