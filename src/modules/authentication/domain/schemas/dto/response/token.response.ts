import { AuthUserResponse } from './user.response';

export interface TokenResponse {
  idAccessToken: string;
  idUser: string;
  typeAuthentication: string;
  provider: string;
  providerAccount: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tokenType: string;
  scope: string;
  user: AuthUserResponse;
  createdAt?: Date;
  updatedAt?: Date;
}
