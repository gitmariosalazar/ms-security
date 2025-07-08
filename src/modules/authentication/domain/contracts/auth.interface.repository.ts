import { TokenResponse } from '../schemas/dto/response/token.response';
import { AccessTokenModel } from '../schemas/model/token.model';
import { AuthUserResponse } from '../schemas/dto/response/user.response';

export interface InterfaceAuthRepository {
  signin(tokenModel: AccessTokenModel): Promise<TokenResponse | null>;
  signup(tokenModel: AccessTokenModel): Promise<TokenResponse | null>;
  findUserByEmail(userEmail: string): Promise<AuthUserResponse | null>;
}
