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
import { AuthPrismaAdapter } from '../adapters/auth.prisma.adapter';

@Injectable()
export class AuthPrismaImplementation implements InterfaceAuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async updateAccessToken(
    tokenModel: AccessTokenModel,
  ): Promise<TokenResponse | null> {
    console.log(tokenModel);
    try {
      const accessTokenUpdated =
        await this.prismaService.accessTokenModel.update({
          where: {
            id_access_token: tokenModel.getIdAccessToken(),
          },
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
            user: {
              include: {
                roleUsers: true,
              },
            },
          },
        });

      return AuthPrismaAdapter.fromAccessTokenModelToTokenResponse(
        accessTokenUpdated,
      );
    } catch (error) {
      throw error;
    }
  }

  async findRevokeTokenByIdUserAndJti(
    idUser: string,
    jti: string,
  ): Promise<RevokeTokenResponse | null> {
    try {
      const revokeTokenFound = await this.prismaService.revokeToken.findFirst({
        where: {
          id_user: idUser,
          jti: jti,
        },
      });

      if (!revokeTokenFound) {
        return null;
      }

      return {
        idRevokeToken: revokeTokenFound.id_revoke_token,
        idAccessToken: revokeTokenFound.id_access_token,
        idUser: revokeTokenFound.id_user,
        reason: revokeTokenFound.reason,
        jti: revokeTokenFound.jti,
        createdAt: revokeTokenFound.created_at,
        updatedAt: revokeTokenFound.updated_at,
      };
    } catch (error) {
      throw error;
    }
  }

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
            user: {
              include: {
                roleUsers: true,
              },
            },
          },
        });

      if (!accessTokenCreated) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Error signing in, please try again later.',
        });
      }

      return AuthPrismaAdapter.fromAccessTokenModelToTokenResponse(
        accessTokenCreated,
      );
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
            user: {
              include: {
                roleUsers: true,
              },
            },
          },
        });

      if (!accessTokenCreated) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Error signuping up, please try again later.',
        });
      }

      return AuthPrismaAdapter.fromAccessTokenModelToTokenResponse(
        accessTokenCreated,
      );
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
          roleUsers: true,
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
        phoneNumber: userFound.phone_number,
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
            user: {
              include: {
                roleUsers: true,
              },
            },
          },
        });
      if (!accessTokenUpdated) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Error refreshing token, please try again later.',
        });
      }
      return AuthPrismaAdapter.fromAccessTokenModelToTokenResponse(
        accessTokenUpdated,
      );
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
