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
import AuthMiddleware from '@user/user.middleware';

import { IRaffleService } from './raffle.interface';
import { RaffleCreateDto, RaffleFindOneDto, RaffleDeleteDto, RaffleFindManyDto, RaffleDto, RaffleUpdateDto } from './dtos';

import { BaseHttpResponse, Request, Validate } from '@http/api';
import { BasePaginationDto } from '@http/dto';
import { RaffleOptionUpdateDto } from '@raffle_option/dtos';

@controller('/raffle')
export class RaffleController extends BaseHttpController implements Controller {
  constructor(@inject(TYPES.IRaffleService) private readonly _raffleService: IRaffleService) {
    super();
  }

  @httpPost('/', AuthMiddleware.validateToken(), Validate.with(RaffleCreateDto))
  public async create(@request() req: Request, @response() res: express.Response) {
    const createdRaffle = await this._raffleService.createOne(req.body);
    const response = BaseHttpResponse.success(createdRaffle);
    return res.json(response);
  }

  @httpPost('/:raffleId/participate', AuthMiddleware.validateToken({ allowNoLoginRequest: true }), Validate.withAll(RaffleOptionUpdateDto))
  public async createParticipation(@request() req: Request, @response() res: express.Response) {
    const createdRaffle = await this._raffleService.createParticipation(req.body);
    const response = BaseHttpResponse.success(createdRaffle);
    return res.json(response);
  }

  @httpGet('/', AuthMiddleware.validateToken({ allowNoLoginRequest: true }), Validate.withQuery(RaffleFindManyDto))
  public async getWithPagination(@request() req: Request, @response() res: express.Response) {
    let response;

    const [raffles, raffleCount] = await Promise.all([
      this._raffleService.findMany(req.body),
      req.body.paginate ? this._raffleService.count(req.body) : undefined,
    ]);

    response = req.body.paginate ? new BasePaginationDto<RaffleDto>(raffleCount, parseInt(req.body.page), raffles) : raffles;
    response = BaseHttpResponse.success(response);

    return res.json(response);
  }

  @httpGet('/search', AuthMiddleware.validateToken({ allowNoLoginRequest: true }), Validate.withQuery(RaffleFindManyDto))
  public async getBySearch(@request() req: Request, @response() res: express.Response) {
    const raffle = await this._raffleService.search(req.body);
    const response = BaseHttpResponse.success(raffle);
    return res.json(response);
  }

  @httpGet('/:id', AuthMiddleware.validateToken({ allowNoLoginRequest: true }), Validate.withParams(RaffleFindOneDto))
  public async getById(@request() req: Request, @response() res: express.Response) {
    const raffle = await this._raffleService.findOne(req.body);
    const response = BaseHttpResponse.success(raffle);
    return res.json(response);
  }

  @httpPut('/:id', AuthMiddleware.validateToken(), Validate.withParams(RaffleUpdateDto))
  public async updateById(@request() req: Request, @response() res: express.Response) {
    const raffle = await this._raffleService.updateOne(req.body);
    const response = BaseHttpResponse.success(raffle);
    return res.json(response);
  }

  @httpDelete('/:id', AuthMiddleware.validateToken(), Validate.withAll(RaffleDeleteDto))
  public async deleteById(@request() req: Request, @response() res: express.Response) {
    const raffle = await this._raffleService.delete(req.body);
    const response = BaseHttpResponse.success(raffle);
    return res.json(response);
  }
}
