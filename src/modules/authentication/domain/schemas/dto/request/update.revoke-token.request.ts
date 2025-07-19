import { ApiProperty } from '@nestjs/swagger';

export class UpdateRevokeTokenRequest {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier for the access token being revoked',
    required: true,
    type: String,
  })
  public idAccessToken: string;

  @ApiProperty({
    example: 'jti-123e4567-e89b-12d3-a456-426614174002',
    description: 'JWT ID for the token being revoked',
    required: true,
    type: String,
  })
  public jti: string;

  @ApiProperty({
    example: 'Token no longer needed',
    description: 'Reason for revoking the token',
    required: false,
    type: String,
  })
  public reason?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'Unique identifier for the user associated with the token',
    required: false,
    type: String,
  })
  public idUser?: string;

  constructor(
    idAccessToken: string,
    jti: string,
    reason?: string,
    idUser?: string,
  ) {
    this.idAccessToken = idAccessToken;
    this.jti = jti;
    this.reason = reason;
    this.idUser = idUser;
  }
}
