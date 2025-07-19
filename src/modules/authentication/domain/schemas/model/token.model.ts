export class AccessTokenModel {
  private idAccessToken: string;
  private idUser: string;
  private typeAuthentication: string;
  private provider: string;
  private providerAccount: string;
  private accessToken: string;
  private expiresAt: Date;
  private tokenType: string;
  private scope: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    idAccessToken: string,
    idUser: string,
    typeAuthentication: string,
    provider: string,
    providerAccount: string,
    accessToken: string,
    expiresAt: Date,
    tokenType: string,
    scope: string,
    createdAt?: Date,
    updatedAt?: Date,
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
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
  getIdAccessToken(): string {
    return this.idAccessToken;
  }
  getIdUser(): string {
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
  getExpiresAt(): Date {
    return this.expiresAt;
  }
  getTokenType(): string {
    return this.tokenType;
  }
  getScope(): string {
    return this.scope;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }
  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  setIdAccessToken(idAccessToken: string): void {
    this.idAccessToken = idAccessToken;
  }
  setIdUser(idUser: string): void {
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
  setExpiresAt(expiresAt: Date): void {
    this.expiresAt = expiresAt;
  }
  setTokenType(tokenType: string): void {
    this.tokenType = tokenType;
  }
  setScope(scope: string): void {
    this.scope = scope;
  }
  setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }
  setUpdatedAt(updatedAt: Date): void {
    this.updatedAt = updatedAt;
  }

  toJSON(): Object {
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
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
