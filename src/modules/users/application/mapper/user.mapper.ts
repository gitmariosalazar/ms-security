import { v4 as uuid } from 'uuid';
import { CreateUserRequest } from '../../domain/schemas/dto/request/create.user.request';
import { UserResponse } from '../../domain/schemas/dto/response/user.response';
import { UserModel } from '../../domain/schemas/model/user.model';

export class UserMapper {
  static fromCreateUserRequestToUserModel(
    userRequest: CreateUserRequest,
  ): UserModel {
    return new UserModel(
      uuid(),
      userRequest.userEmail,
      userRequest.userPassword,
      userRequest.firstName,
      userRequest.lastName,
      userRequest.userActive,
      userRequest.phoneNumber,
      [],
      null,
    );
  }

  static fromUpdateUserRequestToUserModel(
    userRequest: CreateUserRequest,
  ): UserModel {
    return new UserModel(
      uuid(),
      userRequest.userEmail,
      userRequest.userPassword,
      userRequest.firstName,
      userRequest.lastName,
      userRequest.userActive,
      userRequest.phoneNumber,
      [],
      null,
    );
  }

  static fromUserResponseToUserModel(userResponse: UserResponse): UserModel {
    return new UserModel(
      userResponse.idUser,
      userResponse.userEmail,
      '',
      userResponse.firstName,
      userResponse.lastName,
      userResponse.userActive,
      userResponse.phoneNumber,
      [],
      null,
    );
  }
}
