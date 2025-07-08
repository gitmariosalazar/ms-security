import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InterfaceAuthRepository } from 'src/modules/authentication/domain/contracts/auth.interface.repository';
import { TokenResponse } from 'src/modules/authentication/domain/schemas/dto/response/token.response';
import { AuthUserResponse } from 'src/modules/authentication/domain/schemas/dto/response/user.response';
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
            expires_at: tokenModel.getExpiresAt(),
            token_type: tokenModel.getTokenType(),
            scope: tokenModel.getScope(),
            token: tokenModel.getToken(),
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
        expiresAt: accessTokenCreated.expires_at,
        tokenType: accessTokenCreated.token_type,
        scope: accessTokenCreated.scope,
        token: accessTokenCreated.token,
        createdAt: accessTokenCreated.created_at,
        updatedAt: accessTokenCreated.updated_at,
      };
    } catch (error) {
      throw error;
    }
  }

  async signup(tokenModel: AccessTokenModel): Promise<TokenResponse | null> {
    try {
      const accessTokenCreated =
        await this.prismaService.accessTokenModel.create({
          data: {
            id_user: tokenModel.getIdUser(),
            type_authentication: tokenModel.getTypeAuthentication(),
            provider: tokenModel.getProvider(),
            provider_account: tokenModel.getProviderAccount(),
            access_token: tokenModel.getAccessToken(),
            expires_at: tokenModel.getExpiresAt(),
            token_type: tokenModel.getTokenType(),
            scope: tokenModel.getScope(),
            token: tokenModel.getToken(),
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
        expiresAt: accessTokenCreated.expires_at,
        tokenType: accessTokenCreated.token_type,
        scope: accessTokenCreated.scope,
        token: accessTokenCreated.token,
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
}
