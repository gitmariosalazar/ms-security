import { CreateRefreshTokenRequest } from './../../domain/schemas/dto/request/create.refresh-token.request';
import { SignInRequest } from '../../domain/schemas/dto/request/signin.request';
import { SignUpRequest } from '../../domain/schemas/dto/request/signup.request';
import { TokenResponse } from '../../domain/schemas/dto/response/token.response';
import { AuthUserResponse } from '../../domain/schemas/dto/response/user.response';
import { RefreshTokenResponse } from '../../domain/schemas/dto/response/refresh-token.response';
import { CreateRevokeTokenRequest } from '../../domain/schemas/dto/request/create.revoke-token.request';
import { RevokeTokenResponse } from '../../domain/schemas/dto/response/revoke-token.response';

export interface InterfaceAuthUseCase {
  signin(signInRequest: SignInRequest): Promise<TokenResponse | null>;
  signup(signUpRequest: SignUpRequest): Promise<TokenResponse | null>;
  findUserByEmail(userEmail: string): Promise<AuthUserResponse | null>;
  verifyToken(auth_token: string): Promise<boolean>;
  createRefreshToken(
    refreshToken: CreateRefreshTokenRequest,
  ): Promise<RefreshTokenResponse | null>;
  createRevokeToken(
    revokeToken: CreateRevokeTokenRequest,
  ): Promise<RevokeTokenResponse | null>;
}
