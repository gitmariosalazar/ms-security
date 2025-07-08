import { SignInRequest } from "../../domain/schemas/dto/request/signin.request";
import { SignUpRequest } from "../../domain/schemas/dto/request/signup.request";
import { AccessTokenModel } from "../../domain/schemas/model/token.model";
import { IUserPayload } from "../interfaces/user.payload.interface";

export class AuthMapper {
  static toTokenModel(signInRequest: SignInRequest, user: any): AccessTokenModel {
    return new AccessTokenModel(
      0,
      user.idUser,
      'password',
      'local', 
      'providerAccount',
      'accessToken',
      0, 
      'Bearer', 
      'scope', 
      'someToken', 
      new Date(),
      new Date() 
    );
  }

  static fromSignUpRequestToAccessTokenModel(
    userRequest: SignUpRequest,
  ): AccessTokenModel {
    return new AccessTokenModel(
      0,
      0,
      'password',
      'local',
      'providerAccount',
      'accessToken',
      0,
      'Bearer',
      'scope',
      'someToken',
      new Date(),
      new Date(),
    );
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
      userType: user.userType,
    };
  }
}