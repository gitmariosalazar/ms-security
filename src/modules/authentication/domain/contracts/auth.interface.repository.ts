import { TokenResponse } from '../schemas/dto/response/token.response';
import { AccessTokenModel } from '../schemas/model/token.model';
import { AuthUserResponse } from '../schemas/dto/response/user.response';
import { RevokeTokenModel } from '../schemas/model/revoke-token.model';
import { RefreshTokenModel } from '../schemas/model/refresh-token.model';
import { RefreshTokenResponse } from '../schemas/dto/response/refresh-token.response';
import { RevokeTokenResponse } from '../schemas/dto/response/revoke-token.response';

export interface InterfaceAuthRepository {
  signin(tokenModel: AccessTokenModel): Promise<TokenResponse | null>;
  signup(tokenModel: AccessTokenModel): Promise<TokenResponse | null>;
  findUserByEmail(userEmail: string): Promise<AuthUserResponse | null>;
  createRefreshToken(
    refreshToken: RefreshTokenModel,
  ): Promise<RefreshTokenResponse | null>;
  createRevokeToken(
    revokeToken: RevokeTokenModel,
  ): Promise<RevokeTokenResponse | null>;
}
