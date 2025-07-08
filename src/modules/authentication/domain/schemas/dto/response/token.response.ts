export interface TokenResponse {
  idAccessToken: number;
  idUser: number;
  typeAuthentication: string;
  provider: string;
  providerAccount: string;
  accessToken: string;
  expiresAt: number;
  tokenType: string;
  scope: string;
  token: string;
  createdAt?: Date;
  updatedAt?: Date;
}