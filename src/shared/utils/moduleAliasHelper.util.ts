import * as path from 'path';
import moduleAlias from 'module-alias';

import Constants from '../../configs/constants.config';

const files = path.resolve(__dirname, '../../..');
const prefix = Constants.env?.trim() == 'production' ? 'dist' : 'src';

moduleAlias.addAliases({
  '@root': path.join(files, '.'),
  '@shared': path.join(files, `${prefix}/shared`),
  '@configs': path.join(files, `${prefix}/configs`),
  '@modules': path.join(files, `${prefix}/modules`),
  '@user': path.join(files, `${prefix}/modules/user`),
  '@infra': path.join(files, `${prefix}/shared/infra`),
  '@utils': path.join(files, `${prefix}/shared/utils`),
  '@raffle': path.join(files, `${prefix}/modules/raffle`),
  '@http': path.join(files, `${prefix}/shared/infra/http`),
  '@dashboard': path.join(files, `${prefix}/modules/dashboard`),
  '@database': path.join(files, `${prefix}/shared/infra/database`),
  '@payment_option': path.join(files, `${prefix}/modules/payment_option`),
  '@raffle_option': path.join(files, `${prefix}/modules/raffle_option`),
});
