import helmet from 'helmet';
import cors from 'cors';
import * as express from 'express';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

import { Router, errorHandlerMiddleware } from './api';

import '@user/user.controller';
import '@raffle/raffle.controller';
import '@dashboard/dashboard.controller';
import '@payment_option/paymentOption.controller';

export default class Server {
  private readonly _server: InversifyExpressServer;

  constructor(private readonly _port: number = 3000, private readonly _container: Container) {
    this._server = new InversifyExpressServer(this._container, null, {
      rootPath: '/api',
    });
  }

  private setConfig = (app: express.Application) => {
    app.use(cors());
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));
    app.use(express.json({ limit: '50mb' }));
    app.use(helmet());
    app.use(Router);
  };

  private setErrorConfig = (app: express.Application) => {
    app.use(errorHandlerMiddleware);
  };

  public setup(): void {
    this._server
      .setConfig(this.setConfig)
      .setErrorConfig(this.setErrorConfig)
      .build()
      .listen(this._port, () => {
        console.info(`Server is running on port ${this._port}`);
      });
  }
}
