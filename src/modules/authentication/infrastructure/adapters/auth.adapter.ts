import { TokenResponse } from '../../domain/schemas/dto/response/token.response';
import { AccessTokenModel } from '../../domain/schemas/model/token.model';

export class AuthAapter {
  static fromAccessTokenModelToAccessTokenResponse(
    accessTokenModel: AccessTokenModel,
    user: any,
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
      user: {
        idUser: accessTokenModel.getIdUser(),
        userEmail: user.user_email,
        userPassword: user.user_password,
        firstName: user.first_name,
        lastName: user.last_name,
        userActive: user.user_active,
      },
      createdAt: accessTokenModel.getCreatedAt(),
      updatedAt: accessTokenModel.getUpdatedAt(),
    };
  }
}
