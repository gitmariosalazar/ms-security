import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleUserRequest {
  @ApiProperty({
    description: 'The unique identifier of the user',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  idUser: string;

  @ApiProperty({
    description: 'The unique identifier of the user type',
    type: Number,
    example: 1,
    required: true,
  })
  idUserType: number;
}
