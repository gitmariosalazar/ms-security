import { TokenResponse } from "../../domain/schemas/dto/response/token.response";
import { AccessTokenModel } from "../../domain/schemas/model/token.model";


export class AuthAapter{
  static fromAccessTokenModelToAccessTokenResponse(
    accessTokenModel: AccessTokenModel,
  ): TokenResponse {
    return {
      idAccessToken: accessTokenModel.getIdAccessToken(),
      idUser: accessTokenModel.getIdUser(),
      typeAuthentication: accessTokenModel.getTypeAuthentication(),
      provider: accessTokenModel.getProvider(),
      providerAccount: accessTokenModel.getProviderAccount(),
      accessToken: accessTokenModel.getAccessToken(),
      expiresAt: accessTokenModel.getExpiresAt(),
      tokenType: accessTokenModel.getTokenType(),
      scope: accessTokenModel.getScope(),
      token: accessTokenModel.getToken(),
      createdAt: accessTokenModel.getCreatedAt(),
      updatedAt: accessTokenModel.getUpdatedAt(),
    };
  }
}