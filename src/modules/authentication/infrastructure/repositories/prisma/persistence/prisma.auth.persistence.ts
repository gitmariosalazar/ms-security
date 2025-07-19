import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InterfaceAuthRepository } from 'src/modules/authentication/domain/contracts/auth.interface.repository';
import { RefreshTokenResponse } from 'src/modules/authentication/domain/schemas/dto/response/refresh-token.response';
import { RevokeTokenResponse } from 'src/modules/authentication/domain/schemas/dto/response/revoke-token.response';
import { TokenResponse } from 'src/modules/authentication/domain/schemas/dto/response/token.response';
import { AuthUserResponse } from 'src/modules/authentication/domain/schemas/dto/response/user.response';
import { RefreshTokenModel } from 'src/modules/authentication/domain/schemas/model/refresh-token.model';
import { RevokeTokenModel } from 'src/modules/authentication/domain/schemas/model/revoke-token.model';
import { AccessTokenModel } from 'src/modules/authentication/domain/schemas/model/token.model';
import { statusCode } from 'src/settings/environments/status-code';
import { PrismaService } from 'src/shared/prisma/service/prisma.service';

@Injectable()
export class AuthPrismaImplementation implements InterfaceAuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async signin(tokenModel: AccessTokenModel): Promise<TokenResponse | null> {
    try {
      const accessTokenCreated =
        await this.prismaService.accessTokenModel.create({
          data: {
            id_user: tokenModel.getIdUser(),
            type_authentication: tokenModel.getTypeAuthentication(),
            provider: tokenModel.getProvider(),
            provider_account: tokenModel.getProviderAccount(),
            access_token: tokenModel.getAccessToken(),
            expires_at: new Date(tokenModel.getExpiresAt()),
            token_type: tokenModel.getTokenType(),
            scope: tokenModel.getScope(),
          },
          include: {
            user: true,
          },
        });

      if (!accessTokenCreated) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Error signing in, please try again later.',
        });
      }

      return {
        idAccessToken: accessTokenCreated.id_access_token,
        idUser: accessTokenCreated.id_user,
        typeAuthentication: accessTokenCreated.type_authentication,
        provider: accessTokenCreated.provider,
        providerAccount: accessTokenCreated.provider_account,
        accessToken: accessTokenCreated.access_token,
        refreshToken: '',
        expiresAt: Math.floor(
          new Date(accessTokenCreated.expires_at).getTime() / 1000,
        ),
        tokenType: accessTokenCreated.token_type,
        scope: accessTokenCreated.scope,
        user: {
          idUser: accessTokenCreated.user.id_user,
          userEmail: accessTokenCreated.user.user_email,
          userPassword: accessTokenCreated.user.user_password,
          firstName: accessTokenCreated.user.first_name,
          lastName: accessTokenCreated.user.last_name,
          userActive: accessTokenCreated.user.user_active,
          userType: accessTokenCreated.user.id_user_type,
        },
        createdAt: accessTokenCreated.created_at,
        updatedAt: accessTokenCreated.updated_at,
      };
    } catch (error) {
      throw error;
    }
  }

  async signup(tokenModel: AccessTokenModel): Promise<TokenResponse | null> {
    try {
      console.log(tokenModel);

      const accessTokenCreated =
        await this.prismaService.accessTokenModel.create({
          data: {
            id_user: tokenModel.getIdUser(),
            type_authentication: tokenModel.getTypeAuthentication(),
            provider: tokenModel.getProvider(),
            provider_account: tokenModel.getProviderAccount(),
            access_token: tokenModel.getAccessToken(),
            expires_at: new Date(tokenModel.getExpiresAt()),
            token_type: tokenModel.getTokenType(),
            scope: tokenModel.getScope(),
          },
          include: {
            user: true,
          },
        });

      if (!accessTokenCreated) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Error signuping up, please try again later.',
        });
      }

      return {
        idAccessToken: accessTokenCreated.id_access_token,
        idUser: accessTokenCreated.id_user,
        typeAuthentication: accessTokenCreated.type_authentication,
        provider: accessTokenCreated.provider,
        providerAccount: accessTokenCreated.provider_account,
        accessToken: accessTokenCreated.access_token,
        expiresAt: Math.floor(
          new Date(accessTokenCreated.expires_at).getTime() / 1000,
        ),
        tokenType: accessTokenCreated.token_type,
        scope: accessTokenCreated.scope,
        refreshToken: '',
        user: {
          idUser: accessTokenCreated.id_user,
          userEmail: accessTokenCreated.user.user_email,
          userPassword: accessTokenCreated.user.user_password,
          firstName: accessTokenCreated.user.first_name,
          lastName: accessTokenCreated.user.last_name,
          userActive: accessTokenCreated.user.user_active,
          userType: accessTokenCreated.user.id_user_type,
        },
        createdAt: accessTokenCreated.created_at,
        updatedAt: accessTokenCreated.updated_at,
      };
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(userEmail: string): Promise<AuthUserResponse | null> {
    try {
      const userFound = await this.prismaService.user.findFirst({
        where: {
          user_email: userEmail,
        },
        include: {
          user_type: true,
        },
      });

      if (!userFound) {
        return null;
      }

      return {
        idUser: userFound.id_user,
        userEmail: userFound.user_email,
        userPassword: userFound.user_password,
        firstName: userFound.first_name,
        lastName: userFound.last_name,
        createdAt: userFound.created_at,
        updatedAt: userFound.updated_at,
        userActive: userFound.user_active,
      };
    } catch (error) {
      throw error;
    }
  }

  async signout(revokeToken: RevokeTokenModel): Promise<boolean> {
    try {
      const revokeTokenCreated = await this.prismaService.revokeToken.create({
        data: {
          id_access_token: revokeToken.getIdAccessToken(),
          jti: revokeToken.getJti(),
          reason: revokeToken.getReason(),
          id_user: revokeToken.getIdUser(),
        },
      });

      if (!revokeTokenCreated) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Error signing out, please try again later.',
        });
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  async refreshToken(
    refreshToken: RefreshTokenModel,
  ): Promise<TokenResponse | null> {
    try {
      const accessTokenUpdated =
        await this.prismaService.accessTokenModel.update({
          where: {
            id_access_token: refreshToken.getIdRefreshToken(),
          },
          data: {
            access_token: refreshToken.getRefreshToken(),
            expires_at: new Date(Number(refreshToken.getExpiresAt()) * 1000),
            updated_at: new Date(),
          },
          include: {
            user: true,
          },
        });
      if (!accessTokenUpdated) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Error refreshing token, please try again later.',
        });
      }
      return {
        idAccessToken: accessTokenUpdated.id_access_token,
        idUser: accessTokenUpdated.id_user,
        typeAuthentication: accessTokenUpdated.type_authentication,
        provider: accessTokenUpdated.provider,
        providerAccount: accessTokenUpdated.provider_account,
        accessToken: accessTokenUpdated.access_token,
        expiresAt: Math.floor(
          new Date(accessTokenUpdated.expires_at).getTime() / 1000,
        ),
        tokenType: accessTokenUpdated.token_type,
        scope: accessTokenUpdated.scope,
        refreshToken: accessTokenUpdated.id_access_token,
        user: {
          idUser: accessTokenUpdated.user.id_user,
          userEmail: accessTokenUpdated.user.user_email,
          userPassword: accessTokenUpdated.user.user_password,
          firstName: accessTokenUpdated.user.first_name,
          lastName: accessTokenUpdated.user.last_name,
          userActive: accessTokenUpdated.user.user_active,
          userType: accessTokenUpdated.user.id_user_type,
        },
        createdAt: accessTokenUpdated.created_at,
        updatedAt: accessTokenUpdated.updated_at,
      };
    } catch (error) {
      throw error;
    }
  }

  async createRefreshToken(
    refreshToken: RefreshTokenModel,
  ): Promise<RefreshTokenResponse | null> {
    try {
      const refreshTokenCreated =
        await this.prismaService.refreshTokenModel.create({
          data: {
            id_user: refreshToken.getIdUser(),
            id_access_token: refreshToken.getIdAccessToken(),
            refresh_token: refreshToken.getRefreshToken(),
            revoked: refreshToken.isRevoked(),
            expires_at: new Date(refreshToken.getExpiresAt()),
          },
        });

      if (!refreshTokenCreated) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Error creating refresh token, please try again later.',
        });
      }

      return {
        idRefreshToken: refreshTokenCreated.id_refresh_token,
        idUser: refreshTokenCreated.id_user,
        idAccessToken: refreshTokenCreated.id_access_token,
        refreshToken: refreshTokenCreated.refresh_token,
        revoked: refreshTokenCreated.revoked,
        expiresAt: refreshTokenCreated.expires_at,
        createdAt: refreshTokenCreated.created_at,
        updatedAt: refreshTokenCreated.updated_at,
      };
    } catch (error) {
      throw error;
    }
  }

  async createRevokeToken(
    revokeToken: RevokeTokenModel,
  ): Promise<RevokeTokenResponse | null> {
    try {
      const revokeTokenCreated = await this.prismaService.revokeToken.create({
        data: {
          jti: revokeToken.getJti(),
          reason: revokeToken.getReason(),
          id_user: revokeToken.getIdUser(),
          id_access_token: revokeToken.getIdAccessToken(),
        },
      });

      if (!revokeTokenCreated) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Error creating revoke token, please try again later.',
        });
      }

      return {
        idRevokeToken: revokeTokenCreated.id_revoke_token,
        idAccessToken: revokeTokenCreated.id_access_token,
        idUser: revokeTokenCreated.id_user,
        reason: revokeTokenCreated.reason,
        jti: revokeTokenCreated.jti,
        createdAt: revokeTokenCreated.created_at,
        updatedAt: revokeTokenCreated.updated_at,
      };
    } catch (error) {
      throw error;
    }
  }
}
