import { SignInRequest } from '../../domain/schemas/dto/request/signin.request';
import { SignUpRequest } from '../../domain/schemas/dto/request/signup.request';
import { TokenResponse } from '../../domain/schemas/dto/response/token.response';
import { AuthUserResponse } from '../../domain/schemas/dto/response/user.response';

export interface InterfaceAuthUseCase {
  signin(signInRequest: SignInRequest): Promise<TokenResponse | null>;
  signup(signUpRequest: SignUpRequest): Promise<TokenResponse | null>;
  findUserByEmail(userEmail: string): Promise<AuthUserResponse | null>;
}
