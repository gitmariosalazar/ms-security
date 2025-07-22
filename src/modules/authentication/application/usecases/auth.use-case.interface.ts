import { CreateRefreshTokenRequest } from './../../domain/schemas/dto/request/create.refresh-token.request';
import { SignInRequest } from '../../domain/schemas/dto/request/signin.request';
import { SignUpRequest } from '../../domain/schemas/dto/request/signup.request';
import { TokenResponse } from '../../domain/schemas/dto/response/token.response';
import { AuthUserResponse } from '../../domain/schemas/dto/response/user.response';
import { RefreshTokenResponse } from '../../domain/schemas/dto/response/refresh-token.response';
import { CreateRevokeTokenRequest } from '../../domain/schemas/dto/request/create.revoke-token.request';
import { RevokeTokenResponse } from '../../domain/schemas/dto/response/revoke-token.response';
import { SessionResponse } from '../../domain/schemas/dto/response/session.response';
import { VerifyTokenRequest } from '../../domain/schemas/dto/request/verify-token.request';

export interface InterfaceAuthUseCase {
  signin(signInRequest: SignInRequest): Promise<TokenResponse | null>;
  signup(signUpRequest: SignUpRequest): Promise<TokenResponse | null>;
  updateAccessToken(
    signInRequest: SignInRequest,
  ): Promise<TokenResponse | null>;
  findUserByEmail(userEmail: string): Promise<AuthUserResponse | null>;
  verifyToken(verifyToken: VerifyTokenRequest): Promise<SessionResponse | null>;
  getSession(verifyToken: VerifyTokenRequest): Promise<SessionResponse | null>;
  createRefreshToken(
    refreshToken: CreateRefreshTokenRequest,
  ): Promise<RefreshTokenResponse | null>;
  createRevokeToken(
    revokeToken: CreateRevokeTokenRequest,
  ): Promise<RevokeTokenResponse | null>;
  findRevokeTokenByIdUserAndJti(
    auth_token: string,
  ): Promise<RevokeTokenResponse | null>;

  refreshToken(refresh_token: string): Promise<RefreshTokenResponse | null>;
}
