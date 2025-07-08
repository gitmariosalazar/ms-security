export class AccessTokenModel {
  private idAccessToken: number;
  private idUser: number;
  private typeAuthentication: string;
  private provider: string;
  private providerAccount: string;
  private accessToken: string;
  private expiresAt: number;
  private tokenType: string;
  private scope: string;
  private token: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    idAccessToken: number,
    idUser: number,
    typeAuthentication: string,
    provider: string,
    providerAccount: string,
    accessToken: string,
    expiresAt: number,
    tokenType: string,
    scope: string,
    token: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    this.idAccessToken = idAccessToken;
    this.idUser = idUser;
    this.typeAuthentication = typeAuthentication;
    this.provider = provider;
    this.providerAccount = providerAccount;
    this.accessToken = accessToken;
    this.expiresAt = expiresAt;
    this.tokenType = tokenType;
    this.scope = scope;
    this.token = token;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  getIdAccessToken(): number {
    return this.idAccessToken;
  }
  getIdUser(): number {
    return this.idUser;
  }
  getTypeAuthentication(): string {
    return this.typeAuthentication;
  }
  getProvider(): string {
    return this.provider;
  }
  getProviderAccount(): string {
    return this.providerAccount;
  }
  getAccessToken(): string {
    return this.accessToken;
  }
  getExpiresAt(): number {
    return this.expiresAt;
  }
  getTokenType(): string {
    return this.tokenType;
  }
  getScope(): string {
    return this.scope;
  }
  getToken(): string {
    return this.token;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  setIdAccessToken(idAccessToken: number): void {
    this.idAccessToken = idAccessToken;
  }
  setIdUser(idUser: number): void {
    this.idUser = idUser;
  }
  setTypeAuthentication(typeAuthentication: string): void {
    this.typeAuthentication = typeAuthentication;
  }
  setProvider(provider: string): void {
    this.provider = provider;
  }
  setProviderAccount(providerAccount: string): void {
    this.providerAccount = providerAccount;
  }
  setAccessToken(accessToken: string): void {
    this.accessToken = accessToken;
  }
  setExpiresAt(expiresAt: number): void {
    this.expiresAt = expiresAt;
  }
  setTokenType(tokenType: string): void {
    this.tokenType = tokenType;
  }
  setScope(scope: string): void {
    this.scope = scope;
  }
  setToken(token: string): void {
    this.token = token;
  }
  setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }
  setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt;
  }

  toJSON(): Object{
    return {
      idAccessToken: this.idAccessToken,
      idUser: this.idUser,
      typeAuthentication: this.typeAuthentication,
      provider: this.provider,
      providerAccount: this.providerAccount,
      accessToken: this.accessToken,
      expiresAt: this.expiresAt,
      tokenType: this.tokenType,
      scope: this.scope,
      token: this.token,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
