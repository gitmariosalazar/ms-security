import { Prisma } from '@prisma/client';
import { TokenResponse } from 'src/modules/authentication/domain/schemas/dto/response/token.response';

type AccessTokenWithRelations = Prisma.AccessTokenModelGetPayload<{
  include: {
    user: {
      include: {
        roleUsers: true;
      };
    };
  };
}>;

export class AuthPrismaAdapter {
  static fromAccessTokenModelToTokenResponse(
    accessToken: AccessTokenWithRelations,
  ): TokenResponse {
    return {
      idAccessToken: accessToken.id_access_token,
      idUser: accessToken.id_user,
      typeAuthentication: accessToken.type_authentication,
      provider: accessToken.provider,
      providerAccount: accessToken.provider_account,
      accessToken: accessToken.access_token,
      refreshToken: '',
      expiresAt: Math.floor(new Date(accessToken.expires_at).getTime() / 1000),
      tokenType: accessToken.token_type,
      scope: accessToken.scope,
      user: {
        idUser: accessToken.user.id_user,
        userEmail: accessToken.user.user_email,
        userPassword: accessToken.user.user_password,
        firstName: accessToken.user.first_name,
        lastName: accessToken.user.last_name,
        userActive: accessToken.user.user_active,
        roleUsers: accessToken.user.roleUsers.map((role) => ({
          idRoleUser: role.idRoleUser,
          idUser: role.id_user,
          idUserType: role.id_user_type,
          createdAt: role.created_at,
          updatedAt: role.updated_at,
        })),
      },
      createdAt: accessToken.created_at,
      updatedAt: accessToken.updated_at,
    };
  }
}
