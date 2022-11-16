import { UserRoleType } from '../user.enum';
import { MissingFieldException } from '@shared/errors';

export default class UserCreateDto {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public role: UserRoleType = UserRoleType.COMMON,
    public readonly phone?: string,
    public firebaseId?: string
  ) {}

  static from(body: Partial<UserCreateDto>) {
    if (!body.name) throw new MissingFieldException('name');
    if (!body.email) throw new MissingFieldException('email');
    if (!body.password) throw new MissingFieldException('password');
    if (!body.role) body.role = UserRoleType.COMMON;
    return new UserCreateDto(body.name, body.email, body.password, body.role, body.phone);
  }
}
