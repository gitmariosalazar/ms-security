import { Inject, Injectable } from '@nestjs/common';
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
import { IUserPayload } from '../interfaces/user.payload.interface';
import { RevokeTokenModel } from '../../domain/schemas/model/revoke-token.model';
import { RefreshTokenModel } from '../../domain/schemas/model/refresh-token.model';
import { CreateRefreshTokenRequest } from '../../domain/schemas/dto/request/create.refresh-token.request';
import { RefreshTokenResponse } from '../../domain/schemas/dto/response/refresh-token.response';
import { CreateRevokeTokenRequest } from '../../domain/schemas/dto/request/create.revoke-token.request';
import { RevokeTokenResponse } from '../../domain/schemas/dto/response/revoke-token.response';

@Injectable()
export class AuthService implements InterfaceAuthUseCase {
  constructor(
    @Inject('AuthRepository')
    private readonly authRepository: InterfaceAuthRepository,
    @Inject('UserRepository')
    private readonly userRepository: InterfaceUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async verifyToken(auth_token: string): Promise<boolean> {
    try {
      if (!auth_token || auth_token.trim() === '') {
        throw new RpcException({
          statusCode: statusCode.UNAUTHORIZED,
          message: 'Token is required.',
        });
      }

      // Verify the token using the JWT service
      const verify = await this.jwtService.verifyAsync(auth_token, {
        secret: environments.secretKey,
      });
      if (!verify) {
        throw new RpcException({
          statusCode: statusCode.UNAUTHORIZED,
          message: 'Invalid token.',
        });
      }
      console.log(verify);
      console.log(verify!!);
      return true; // Return true if the token is valid
    } catch (error) {
      console.error(`Error verifying token: ${error.message}`);
      throw new RpcException({
        statusCode: statusCode.UNAUTHORIZED,
        message: 'Token is not valid or has expired. ❌',
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
        expiresIn: '1h',
        algorithm: 'HS256',
      });

      tokenModel.setAccessToken(accessToken);
      tokenModel.setExpiresAt(new Date(Date.now() + 60000 * 60)); // 1 hour expiration
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
          user: {
            id: user.idUser,
          },
        },
        {
          secret: environments.secretKey,
          expiresIn: '1h', // 1 hour expiration
          algorithm: 'HS256',
        },
      );

      const createRefreshTokenRequest: CreateRefreshTokenRequest =
        new CreateRefreshTokenRequest(
          user.idUser,
          tokenResponse.idAccessToken,
          refreshToken,
          false,
          new Date(Date.now() + 3600000), // 1 hour expiration
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

      const userModel = UserMapper.fromCreateUserRequestToUserModel(
        userRequest,
        new UserTypeModel(
          1,
          'Default User Type',
          'This is a default user type description.',
        ),
      );

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
        expiresIn: '1h', // 1 hour expiration
        // expiresIn: '1m', // 1 minute expiration for testing
        algorithm: 'HS256',
      });

      tokenModel.setAccessToken(accessToken);
      tokenModel.setTokenType('Bearer');
      tokenModel.setExpiresAt(new Date(Date.now() + 3600000)); // 1 hour expiration
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
          user: {
            id: createdUser.idUser,
          },
        },
        {
          secret: environments.secretKey,
          expiresIn: '1h', // 1 hour expiration
          algorithm: 'HS256',
        },
      );

      const createRefreshTokenRequest: CreateRefreshTokenRequest =
        new CreateRefreshTokenRequest(
          createdUser.idUser,
          tokenResponse.idAccessToken,
          refreshToken,
          false,
          new Date(Date.now() + 3600000), // 1 hour expiration
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
function ms(arg0: string) {
  throw new Error('Function not implemented.');
}
