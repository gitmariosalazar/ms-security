import { ApiProperty } from '@nestjs/swagger';

export class CreateRefreshTokenRequest {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description:
      'Unique identifier for the user associated with the refresh token',
    required: true,
    type: String,
  })
  public idUser: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description:
      'Unique identifier for the access token associated with the refresh token',
    required: true,
    type: String,
  })
  public idAccessToken: string;

  @ApiProperty({
    example: 'refresh-token-123e4567-e89b-12d3-a456-426614174002',
    description: 'The refresh token string',
    required: true,
    type: String,
  })
  public refreshToken: string;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the refresh token has been revoked',
    required: false,
    type: Boolean,
  })
  public revoked?: boolean;

  @ApiProperty({
    example: '2023-10-01T00:00:00Z',
    description: 'Expiration date of the refresh token',
    required: true,
    type: Date,
  })
  public expiresAt: Date;

  constructor(
    idUser: string,
    idAccessToken: string,
    refreshToken: string,
    revoked?: boolean,
    expiresAt?: Date,
  ) {
    this.idUser = idUser;
    this.idAccessToken = idAccessToken;
    this.refreshToken = refreshToken;
    this.revoked = revoked;
    this.expiresAt = expiresAt || new Date();
  }
}
