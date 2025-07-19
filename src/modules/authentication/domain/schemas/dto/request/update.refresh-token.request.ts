import { ApiProperty } from '@nestjs/swagger';

export class UpdateRefreshTokenRequest {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the refresh token being updated',
    required: true,
    type: String,
  })
  public idRefreshToken: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description:
      'Unique identifier for the user associated with the refresh token',
    required: true,
    type: String,
  })
  public idUser: string;

  @ApiProperty({
    example: 'new-refresh-token-value',
    description: 'New value for the refresh token',
    required: true,
    type: String,
  })
  public refreshToken: string;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the refresh token is revoked',
    required: false,
    type: Boolean,
  })
  public revoked?: boolean;

  constructor(
    idRefreshToken: string,
    idUser: string,
    refreshToken: string,
    revoked?: boolean,
  ) {
    this.idRefreshToken = idRefreshToken;
    this.idUser = idUser;
    this.refreshToken = refreshToken;
    this.revoked = revoked;
  }
}
