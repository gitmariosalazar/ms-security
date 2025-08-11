import { Inject, Injectable, Logger } from '@nestjs/common';
import { InterfaceAuthUseCase } from '../usecases/auth.use-case.interface';
import { InterfaceAuthRepository } from '../../domain/contracts/auth.interface.repository';
import { InterfaceUserRepository } from 'src/modules/users/domain/contracts/user.repository.interface';
import { SignInRequest } from '../../domain/schemas/dto/request/signin.request';
import { TokenResponse } from '../../domain/schemas/dto/response/token.response';
import { validateFields } from 'src/shared/utils/validators/fields.validators';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from 'src/settings/environments/status-code';
import { AuthMapper } from '../mappers/auth.mapper';
import { AccessTokenModel } from '../../domain/schemas/model/token.model';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpRequest } from '../../domain/schemas/dto/request/signup.request';
import { UserMapper } from 'src/modules/users/application/mapper/user.mapper';
import { CreateUserRequest } from 'src/modules/users/domain/schemas/dto/request/create.user.request';
import { UserTypeModel } from 'src/modules/user-type/domain/schemas/model/user-type.model';
import { AuthUserResponse } from '../../domain/schemas/dto/response/user.response';
import { environments } from 'src/settings/environments/environments';
import { User } from '../../domain/schemas/dto/response/user.auth.response';
import {
  IRefreshTokenPayload,
  IUserPayload,
} from '../interfaces/user.payload.interface';
import { RevokeTokenModel } from '../../domain/schemas/model/revoke-token.model';
import { RefreshTokenModel } from '../../domain/schemas/model/refresh-token.model';
import { CreateRefreshTokenRequest } from '../../domain/schemas/dto/request/create.refresh-token.request';
import { RefreshTokenResponse } from '../../domain/schemas/dto/response/refresh-token.response';
import { CreateRevokeTokenRequest } from '../../domain/schemas/dto/request/create.revoke-token.request';
import { RevokeTokenResponse } from '../../domain/schemas/dto/response/revoke-token.response';
import { SessionResponse } from '../../domain/schemas/dto/response/session.response';
import { VerifyTokenRequest } from '../../domain/schemas/dto/request/verify-token.request';
import { isIP } from 'net';

@Injectable()
export class AuthService implements InterfaceAuthUseCase {
  private readonly expireAtAccessToken: [Date, string] = [
    new Date(Date.now() + 10 * 5 * 60 * 1000), // 50 minutes expiration
    '50m',
  ];
  private readonly expireAtRefreshToken: [Date, string] = [
    new Date(Date.now() + 60 * 5 * 60 * 1000),
    '5h',
  ];
  constructor(
    @Inject('AuthRepository')
    private readonly authRepository: InterfaceAuthRepository,
    @Inject('UserRepository')
    private readonly userRepository: InterfaceUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async updateAccessToken(
    signInRequest: SignInRequest,
  ): Promise<TokenResponse | null> {
    try {
      const user = await this.userRepository.findById(signInRequest.email);
      if (!user) {
        throw new RpcException({
          statusCode: statusCode.UNAUTHORIZED,
          message: 'User not found.',
        });
      }

      const payload: IUserPayload = AuthMapper.toUserPayload(user);
      const newAccessToken = this.jwtService.sign(payload, {
        secret: environments.secretKey,
        expiresIn: this.expireAtAccessToken[1], // 5 minutes expiration
        algorithm: 'HS256',
      });

      const updateAccessTokenModel: AccessTokenModel = AuthMapper.toTokenModel(
        signInRequest,
        user,
      );

      const updatedToken = await this.authRepository.updateAccessToken(
        updateAccessTokenModel,
      );

      return updatedToken;
    } catch (error) {
      console.error(`Error updating access token: ${error.message}`);
      throw new RpcException({
        statusCode: statusCode.UNAUTHORIZED,
        message: 'Failed to update access token.',
      });
    }
  }

  async refreshToken(
    refresh_token: string,
  ): Promise<RefreshTokenResponse | null> {
    try {
      if (!refresh_token || refresh_token.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.UNAUTHORIZED,
          message: 'Refresh token is required.',
        });
      }

      const payload: IRefreshTokenPayload = await this.jwtService.verifyAsync(
        refresh_token,
        {
          secret: environments.secretKey,
        },
      );

      if (!payload || !payload.idUser || !payload.idAccessToken) {
        throw new RpcException({
          statusCode: statusCode.UNAUTHORIZED,
          message: 'Invalid refresh token payload.',
        });
      }

      const isRevokedToken: RevokeTokenResponse | null =
        await this.authRepository.findRevokeTokenByIdUserAndJti(
          payload.idUser,
          payload.idAccessToken,
        );

      if (isRevokedToken !== null) {
        throw new RpcException({
          statusCode: statusCode.UNAUTHORIZED,
          message: 'Refresh token has been revoked.',
        });
      }

      const user = await this.userRepository.findById(payload.idUser);

      if (!user) {
        throw new RpcException({
          statusCode: statusCode.UNAUTHORIZED,
          message: 'User not found for the provided refresh token.',
        });
      }

      //const { userType, ...rest } = user;

      //const resultUser = { ...rest, userType: userType.idUserType };
      //console.log(resultUser);

      const newPayload: IUserPayload = AuthMapper.toUserPayload(user);

      const newAccessToken = this.jwtService.sign(newPayload, {
        secret: environments.secretKey,
        expiresIn: this.expireAtAccessToken[1], // 5 minutes expiration
        algorithm: 'HS256',
      });

      const signInRequest: SignInRequest = new SignInRequest(
        user.userEmail,
        '',
      );

      const updateAccessTokenModel: AccessTokenModel = AuthMapper.toTokenModel(
        signInRequest,
        user,
      );
      updateAccessTokenModel.setIdAccessToken(payload.idAccessToken);
      updateAccessTokenModel.setAccessToken(newAccessToken);
      updateAccessTokenModel.setExpiresAt(this.expireAtAccessToken[0]);
      updateAccessTokenModel.setCreatedAt(new Date());
      const updatedToken = await this.authRepository.updateAccessToken(
        updateAccessTokenModel,
      );

      if (!updatedToken) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Error updating access token, please try again later.',
        });
      }

      const refreshTokenResponse: RefreshTokenResponse = {
        idRefreshToken: payload.idAccessToken,
        idUser: payload.idUser,
        idAccessToken: updatedToken.idAccessToken,
        refreshToken: refresh_token,
        revoked: false,
        accessToken: updatedToken.accessToken,
        expiresAt: new Date(payload.exp * 1000), // 5 minutes expiration
      };
      return refreshTokenResponse;
    } catch (error) {
      console.error(`Error refreshing token: ${error.message}`);
      throw new RpcException({
        statusCode: statusCode.UNAUTHORIZED,
        message: 'Refresh token is not valid or has expired.',
      });
    }
  }

  async findRevokeTokenByIdUserAndJti(
    auth_token: string,
  ): Promise<RevokeTokenResponse | null> {
    try {
      if (!auth_token || auth_token.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.UNAUTHORIZED,
          message: 'Token is required.',
        });
      }

      const decodeToken = await this.jwtService.decode(auth_token);

      if (!decodeToken || !decodeToken['idUser'] || !decodeToken['jti']) {
        throw new RpcException({
          statusCode: statusCode.UNAUTHORIZED,
          message: 'Invalid token payload.',
        });
      }

      const revokeToken =
        await this.authRepository.findRevokeTokenByIdUserAndJti(
          decodeToken['idUser'],
          decodeToken['jti'],
        );

      if (!revokeToken) {
        return null;
      }

      return revokeToken;
    } catch (error) {
      console.error(`Error finding revoke token: ${error.message}`);
      throw new RpcException({
        statusCode: statusCode.INTERNAL_SERVER_ERROR,
        message: 'Error finding revoke token.',
      });
    }
  }

  /*

  async getSession(
    verifyToken: VerifyTokenRequest,
  ): Promise<SessionResponse | null> {
    try {
      if (!verifyToken.auth_token || verifyToken.auth_token.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.UNAUTHORIZED,
          message: 'Token is required.',
        });
      }

      // Verify the token using the JWT service
      const verify = await this.jwtService.decode(verifyToken.auth_token);
      if (!verify) {
        throw new RpcException({
          statusCode: statusCode.UNAUTHORIZED,
          message: 'Invalid token.',
        });
      }

      return {
        sessionId: verify.sessionId,
        userId: verify.idUser,
        createdAt: new Date(verify.iat * 1000), // Convert seconds to milliseconds
        expiresAt: new Date(verify.exp * 1000), // Convert seconds to milliseconds
        ipAddress: verifyToken.ipAddress || 'Unknown',
        location: {
          country: 'Unknown',
          city: 'Unknown',
          region: 'Unknown',
        },
      };
    } catch (error) {
      console.error(`Error getting session: ${error.message}`);
      throw new RpcException({
        statusCode: statusCode.UNAUTHORIZED,
        message: 'Session retrieval failed.',
      });
    }
  }
*/

  async getSession(
    verifyToken: VerifyTokenRequest,
  ): Promise<SessionResponse | null> {
    const logger = new Logger('SessionService');

    try {
      if (!verifyToken.auth_token || verifyToken.auth_token.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.UNAUTHORIZED,
          message: 'Token is required.',
        });
      }

      if (!isIP(verifyToken.ipAddress)) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Invalid IP address format.',
        });
      }

      if (
        verifyToken.refresh_token &&
        verifyToken.refresh_token.trim() === ''
      ) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Refresh token cannot be empty.',
        });
      }

      // Verify the token using the JWT service
      const decodedAuthToken = await this.jwtService.decode(
        verifyToken.auth_token,
      );

      if (!decodedAuthToken) {
        throw new RpcException({
          statusCode: statusCode.UNAUTHORIZED,
          message: 'Invalid token.',
        });
      }
      console.log(`---------- Decoded Auth Token:`);
      console.log(decodedAuthToken);
      console.log(`---------- Decoded Auth Token ----------`);

      const isExpiredToken: boolean = decodedAuthToken.exp < Date.now() / 1000;

      const decodedRefreshToken = await this.jwtService.decode(
        verifyToken.refresh_token,
      );

      if (!decodedRefreshToken) {
        throw new RpcException({
          statusCode: statusCode.UNAUTHORIZED,
          message: 'Invalid refresh token.',
        });
      }

      console.log(`---------- Decoded Refresh Token:`);
      console.log(decodedRefreshToken);
      console.log(`---------- Decoded Refresh Token ----------`);
      const isExpiredRefreshToken: boolean =
        decodedRefreshToken.exp < Date.now() / 1000;
      return {
        sessionId: decodedAuthToken.jti, // Usar jti como sessionId
        userId: decodedAuthToken.idUser,
        createdAtAccessToken: new Date(decodedAuthToken.iat * 1000),
        expiresAtAccessToken: new Date(decodedAuthToken.exp * 1000),
        createdAtRefreshToken: new Date(decodedRefreshToken.iat * 1000),
        expiresAtRefreshToken: new Date(decodedRefreshToken.exp * 1000),
        ipAddress: verifyToken.ipAddress || 'Unknown',
        location: {
          country: 'Unknown',
          city: 'Unknown',
          region: 'Unknown',
        },
        refreshTokenValid: !isExpiredRefreshToken, // Refresh token es válido
        accessTokenValid: !isExpiredToken, // Access token es válido
      };
    } catch (error) {
      logger.error(`Error in getSession: ${error.message}`);
      throw error;
    }
  }
  async verifyToken(
    verifyToken: VerifyTokenRequest,
  ): Promise<SessionResponse | null> {
    try {
      if (!verifyToken.auth_token || verifyToken.auth_token.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.UNAUTHORIZED,
          message: 'Token is required.',
        });
      }

      // Verify the token using the JWT service
      const verify = await this.jwtService.verifyAsync(verifyToken.auth_token, {
        secret: environments.secretKey,
      });
      console.log(verify);
      if (!verify) {
        throw new RpcException({
          statusCode: statusCode.UNAUTHORIZED,
          message: 'Invalid token.',
        });
      }
      return {
        sessionId: verify.sessionId,
        userId: verify.idUser,
        createdAtAccessToken: new Date(verify.iat * 1000), // Convert seconds to milliseconds
        expiresAtAccessToken: new Date(verify.exp * 1000), // Convert seconds to milliseconds
        ipAddress: verifyToken.ipAddress || 'Unknown',
        location: {
          country: 'Unknown',
          city: 'Unknown',
          region: 'Unknown',
        },
      };
    } catch (error) {
      console.error(`Error verifying token: ${error.message}`);
      throw new RpcException({
        statusCode: statusCode.UNAUTHORIZED,
        message: 'Token is not valid or has expired-----1. ❌',
      });
    }
  }

  async getCurrentUser(auth_token: string): Promise<User | null> {
    try {
      if (!auth_token || auth_token.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.UNAUTHORIZED,
          message: 'Token is required.',
        });
      }

      const payload: IUserPayload = await this.jwtService.verifyAsync(
        auth_token,
        {
          secret: environments.secretKey,
        },
      );

      if (!payload || !payload.idUser || !payload.userEmail) {
        throw new RpcException({
          statusCode: statusCode.UNAUTHORIZED,
          message: 'Invalid token payload.',
        });
      }

      // Fetch the user by ID

      const user = await this.userRepository.findById(payload.idUser);
      if (!user) {
        throw new RpcException({
          statusCode: statusCode.UNAUTHORIZED,
          message: 'User not found for the provided token. ❌',
        });
      }
      return AuthMapper.toAuthUserResponse(user);
    } catch (error) {
      console.log(`first error in getCurrentUser: ${error.message}`);
      throw new RpcException({
        statusCode: statusCode.UNAUTHORIZED,
        message: 'Token is not valid or has expired.',
      });
    }
  }

  async signin(signInRequest: SignInRequest): Promise<TokenResponse | null> {
    try {
      const requiredFields: string[] = ['email', 'password'];

      const missingFieldsMessages: string[] = validateFields(
        signInRequest,
        requiredFields,
      );

      if (missingFieldsMessages.length > 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: missingFieldsMessages,
        });
      }

      const user = await this.findUserByEmail(signInRequest.email);
      if (!user) {
        throw new RpcException({
          statusCode: statusCode.UNAUTHORIZED,
          message: 'Invalid credentials, user email or password is incorrect!.',
        });
      }

      const isPasswordValid = bcrypt.compareSync(
        signInRequest.password,
        user.userPassword,
      );
      if (!isPasswordValid) {
        throw new RpcException({
          statusCode: statusCode.UNAUTHORIZED,
          message: 'Invalid credentials, user email or password is incorrect!.',
        });
      }

      if (user.userActive === false) {
        throw new RpcException({
          statusCode: statusCode.UNAUTHORIZED,
          message: 'User is not active.',
        });
      }

      const tokenModel: AccessTokenModel = AuthMapper.toTokenModel(
        signInRequest,
        user,
      );

      const payload: IUserPayload = AuthMapper.toUserPayload(user);

      const accessToken = this.jwtService.sign(payload, {
        secret: environments.secretKey,
        expiresIn: this.expireAtAccessToken[1],
        algorithm: 'HS256',
      });

      tokenModel.setAccessToken(accessToken);
      tokenModel.setExpiresAt(this.expireAtAccessToken[0]);
      tokenModel.setCreatedAt(new Date());
      tokenModel.setUpdatedAt(new Date());
      tokenModel.setIdUser(user.idUser);
      tokenModel.setTypeAuthentication('password');
      tokenModel.setProvider('local');
      tokenModel.setProviderAccount('providerAccount');
      tokenModel.setScope('scope');

      const tokenResponse = await this.authRepository.signin(tokenModel);
      if (!tokenResponse) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Error signing in, please try again later.',
        });
      }

      // Generate refresh token
      const refreshToken = this.jwtService.sign(
        {
          idUser: user.idUser,
          idAccessToken: tokenResponse.idAccessToken,
        },
        {
          secret: environments.secretKey,
          expiresIn: this.expireAtRefreshToken[1],
          algorithm: 'HS256',
        },
      );

      const createRefreshTokenRequest: CreateRefreshTokenRequest =
        new CreateRefreshTokenRequest(
          user.idUser,
          tokenResponse.idAccessToken,
          refreshToken,
          false,
          this.expireAtRefreshToken[0],
        );

      const refreshTokenModel: RefreshTokenModel =
        AuthMapper.fromCreateRefreshTokenToRefreshTokenModel(
          createRefreshTokenRequest,
        );

      const createdRefreshToken: RefreshTokenResponse =
        await this.authRepository.createRefreshToken(refreshTokenModel);

      if (!createdRefreshToken) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Error creating refresh token, please try again later.',
        });
      }
      tokenResponse.refreshToken = createdRefreshToken.refreshToken;

      return tokenResponse;
    } catch (error) {
      throw error;
    }
  }

  async signup(signUpRequest: SignUpRequest): Promise<TokenResponse | null> {
    try {
      const requiredFields: string[] = [
        'userEmail',
        'userPassword',
        'confirmPassword',
        'firstName',
        'lastName',
      ];

      const missingFieldsMessages: string[] = validateFields(
        signUpRequest,
        requiredFields,
      );

      if (missingFieldsMessages.length > 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: missingFieldsMessages,
        });
      }

      const existingUser = await this.findUserByEmail(signUpRequest.userEmail);
      if (existingUser) {
        throw new RpcException({
          statusCode: statusCode.CONFLICT,
          message: 'User already exists with this email.',
        });
      }

      if (signUpRequest.userPassword !== signUpRequest.confirmPassword) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'Passwords do not match.',
        });
      }

      const hashedPassword = await bcrypt.hash(signUpRequest.userPassword, 10);

      const userRequest: CreateUserRequest = new CreateUserRequest(
        signUpRequest.userEmail,
        hashedPassword,
        signUpRequest.firstName,
        signUpRequest.lastName,
        true,
        1,
      );

      const userModel =
        UserMapper.fromCreateUserRequestToUserModel(userRequest);

      const createdUser = await this.userRepository.create(userModel);
      if (!createdUser) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Error creating user, please try again later.',
        });
      }

      const tokenModel: AccessTokenModel =
        AuthMapper.fromSignUpRequestToAccessTokenModel(signUpRequest);

      const payload = AuthMapper.toUserPayload(createdUser);

      const accessToken = this.jwtService.sign(payload, {
        secret: environments.secretKey,
        expiresIn: this.expireAtAccessToken[1], // 5 minutes expiration
        // expiresIn: '1m', // 1 minute expiration for testing
        algorithm: 'HS256',
      });

      tokenModel.setAccessToken(accessToken);
      tokenModel.setTokenType('Bearer');
      tokenModel.setExpiresAt(this.expireAtAccessToken[0]);
      tokenModel.setCreatedAt(new Date());
      tokenModel.setUpdatedAt(new Date());
      tokenModel.setIdUser(createdUser.idUser);
      tokenModel.setTypeAuthentication('password');
      tokenModel.setProvider('local');
      tokenModel.setProviderAccount('providerAccount');
      tokenModel.setScope('scope');

      const tokenResponse = await this.authRepository.signup(tokenModel);
      if (!tokenResponse) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Error signing up, please try again later.',
        });
      }

      const refreshToken = this.jwtService.sign(
        {
          idUser: createdUser.idUser,
          idAccessToken: tokenResponse.idAccessToken,
        },
        {
          secret: environments.secretKey,
          expiresIn: this.expireAtRefreshToken[1],
          algorithm: 'HS256',
        },
      );

      const createRefreshTokenRequest: CreateRefreshTokenRequest =
        new CreateRefreshTokenRequest(
          createdUser.idUser,
          tokenResponse.idAccessToken,
          refreshToken,
          false,
          this.expireAtRefreshToken[0],
        );

      const refreshTokenModel: RefreshTokenModel =
        AuthMapper.fromCreateRefreshTokenToRefreshTokenModel(
          createRefreshTokenRequest,
        );

      const createdRefreshToken: RefreshTokenResponse =
        await this.authRepository.createRefreshToken(refreshTokenModel);
      if (!createdRefreshToken) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Error creating refresh token, please try again later.',
        });
      }

      tokenResponse.refreshToken = createdRefreshToken.refreshToken;
      return tokenResponse;
    } catch (error) {
      throw error;
    }
  }

  async findUserByEmail(userEmail: string): Promise<AuthUserResponse | null> {
    try {
      const user = await this.authRepository.findUserByEmail(userEmail);
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async createRefreshToken(
    refreshToken: CreateRefreshTokenRequest,
  ): Promise<RefreshTokenResponse | null> {
    try {
      const refreshTokenModel: RefreshTokenModel =
        AuthMapper.fromCreateRefreshTokenToRefreshTokenModel(refreshToken);
      const createdRefreshToken =
        await this.authRepository.createRefreshToken(refreshTokenModel);
      if (!createdRefreshToken) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Error creating refresh token, please try again later.',
        });
      }
      return createdRefreshToken;
    } catch (error) {
      throw error;
    }
  }

  async createRevokeToken(
    revokeToken: CreateRevokeTokenRequest,
  ): Promise<RevokeTokenResponse | null> {
    try {
      const revokeTokenModel: RevokeTokenModel =
        AuthMapper.fromCreateRevokedTokenRequestToRevokedTokenModel(
          revokeToken,
        );
      const createdRevokeToken =
        await this.authRepository.createRevokeToken(revokeTokenModel);
      if (!createdRevokeToken) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Error creating revoke token, please try again later.',
        });
      }
      return createdRevokeToken;
    } catch (error) {
      throw error;
    }
  }
}
