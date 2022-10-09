import * as express from 'express';
import { inject } from 'inversify';
import { controller, request, response, BaseHttpController, Controller, httpGet } from 'inversify-express-utils';

import { TYPES } from '@shared/ioc/types.ioc';

import AuthMiddleware from '@user/user.middleware';

import { IUserService } from '@user/user.interface';
import { IRaffleService } from '@raffle/raffle.interface';

import { DashboardFindManyDto } from './dtos';

import { BaseHttpResponse, Request, Validate } from '@http/api';

@controller('/dashboard')
export class DashboardController extends BaseHttpController implements Controller {
  constructor(
    @inject(TYPES.IUserService) private readonly _userService: IUserService,
    @inject(TYPES.IRaffleService) private readonly _raffleService: IRaffleService
  ) {
    super();
  }

  @httpGet('/count', AuthMiddleware.validateToken(), Validate.withQuery(DashboardFindManyDto))
  public async getCount(@request() req: Request, @response() res: express.Response) {
    const [userCount, raffleCount] = await Promise.all([this._userService.count(req.body), this._raffleService.count(req.body)]);
    const response = BaseHttpResponse.success({ userCount, raffleCount });
    return res.json(response);
  }
}
