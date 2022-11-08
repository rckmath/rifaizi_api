import { inject, injectable } from 'inversify';

import { IUserRepository, IUserService } from './user.interface';
import { FIREBASE_ERROR_MESSAGE } from './user.errors';

import { TYPES } from '@shared/ioc/types.ioc';
import { UserCreateDto, UserDeleteDto, UserDto, UserFindManyDto, UserFindOneDto, UserUpdateDto } from './dtos';

import FirebaseClient from '@infra/firebase';
import { FirebaseIntegrationException, NotFoundException } from '@shared/errors';

@injectable()
export class UserService implements IUserService {
  constructor(@inject(TYPES.IUserRepository) private readonly _repository: IUserRepository) {}
  async createUserOnFirebase(user: UserCreateDto): Promise<string> {
    let firebaseUserId = null;
    let formattedPhoneNumber;

    try {
      if (user.phone) {
        formattedPhoneNumber = '+55' + user.phone.replace('(', '').replace(')', '').replace('-', '').replace(' ', '').trim();
      }

      const firebaseUser = await FirebaseClient.auth().createUser({
        email: user.email,
        displayName: user.name,
        password: user.password,
        phoneNumber: formattedPhoneNumber,
      });

      if (!firebaseUser) {
        throw new FirebaseIntegrationException({ message: FIREBASE_ERROR_MESSAGE.USER_CREATION });
      }

      firebaseUserId = firebaseUser.uid;
    } catch (err: any) {
      throw new FirebaseIntegrationException(err);
    }

    return firebaseUserId;
  }

  async updateUserOnFirebase(firebaseId: string, user: UserUpdateDto): Promise<void> {
    let formattedPhoneNumber;

    if (user.phone) {
      formattedPhoneNumber = '+55' + user.phone.replace('(', '').replace(')', '').replace('-', '').replace(' ', '').trim();
    }

    await FirebaseClient.auth().updateUser(firebaseId, { displayName: user.name, phoneNumber: formattedPhoneNumber });
  }

  async createOne(user: UserCreateDto): Promise<UserDto> {
    user.firebaseId = await this.createUserOnFirebase(user);
    const response = await this._repository.create(user);
    return this.findOne({ id: response.id });
  }

  async findOne(user: UserFindOneDto): Promise<UserDto> {
    const foundUser = await this._repository.findOne(user);
    if (!foundUser) throw new NotFoundException('User');
    return UserDto.from(foundUser);
  }

  async findMany(searchParameters: UserFindManyDto): Promise<Array<UserDto>> {
    const foundUsers = await this._repository.find(searchParameters);
    return UserDto.fromMany(foundUsers);
  }

  async count(searchParameters: UserFindManyDto): Promise<number> {
    return this._repository.count(searchParameters);
  }

  async updateOne(user: UserUpdateDto): Promise<void> {
    const userData = await this._repository.findOne({ id: user.id });
    if (userData?.firebaseId) await this.updateUserOnFirebase(userData?.firebaseId, user);
    return this._repository.update(user.id, user);
  }

  async delete(user: UserDeleteDto): Promise<void> {
    const idList = user.id as Array<string>;
    const userList = await Promise.all(idList.map(async (id) => this._repository.findOne({ id })));
    if (!userList.length) return;
    const firebasePromises = userList.map(async (user) => user && FirebaseClient.auth().deleteUser(user.firebaseId));
    await Promise.all([...firebasePromises, this._repository.delete(idList)]);
  }
}
