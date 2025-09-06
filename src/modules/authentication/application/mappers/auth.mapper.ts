import { User } from './../../domain/schemas/dto/response/user.auth.response';
import { UserResponse } from 'src/modules/users/domain/schemas/dto/response/user.response';
import { SignInRequest } from '../../domain/schemas/dto/request/signin.request';
import { SignUpRequest } from '../../domain/schemas/dto/request/signup.request';
import { AccessTokenModel } from '../../domain/schemas/model/token.model';
import { IUserPayload } from '../interfaces/user.payload.interface';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenModel } from '../../domain/schemas/model/refresh-token.model';
import { CreateRefreshTokenRequest } from '../../domain/schemas/dto/request/create.refresh-token.request';
import { RevokeTokenModel } from '../../domain/schemas/model/revoke-token.model';
import { CreateRevokeTokenRequest } from '../../domain/schemas/dto/request/create.revoke-token.request';

export class AuthMapper {
  static toTokenModel(
    signInRequest: SignInRequest,
    user: any,
  ): AccessTokenModel {
    return new AccessTokenModel(
      uuidv4(),
      user.idUser,
      'password',
      'local',
      'providerAccount',
      'accessToken',
      new Date(),
      'Bearer',
      'scope',
    );
  }

  static fromSignUpRequestToAccessTokenModel(
    userRequest: SignUpRequest,
  ): AccessTokenModel {
    return new AccessTokenModel(
      uuidv4(),
      '',
      'password',
      'local',
      'providerAccount',
      'accessToken',
      new Date(),
      'Bearer',
      'scope',
    );
  }

  static toAuthUserResponse(user: UserResponse): User {
    return {
      idUser: user.idUser,
      userEmail: user.userEmail,
      firstName: user.firstName,
      lastName: user.lastName,
      userActive: user.userActive,
      phoneNumber: user.phoneNumber,
      roleUsers: user.roleUser,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toUserPayload(user: any): IUserPayload {
    return {
      idUser: user.idUser,
      userEmail: user.userEmail,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      isActive: user.userActive,
      date: user.createdAt,
      roleUsers: user.roleUsers,
      jti: uuidv4(), // Generate a unique identifier for the JWT
    };
  }

  static fromCreateRefreshTokenToRefreshTokenModel(
    refreshToken: CreateRefreshTokenRequest,
  ): RefreshTokenModel {
    return new RefreshTokenModel(
      uuidv4(),
      refreshToken.idUser,
      refreshToken.idAccessToken,
      refreshToken.refreshToken,
      refreshToken.revoked,
      refreshToken.expiresAt,
    );
  }

  static fromCreateRevokedTokenRequestToRevokedTokenModel(
    refreshToken: CreateRevokeTokenRequest,
  ): RevokeTokenModel {
    return new RevokeTokenModel(
      uuidv4(),
      refreshToken.idAccessToken,
      refreshToken.jti,
      refreshToken.reason,
      refreshToken.idUser,
    );
  }
}
