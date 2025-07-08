import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from '../../application/services/user.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateUserRequest } from '../../domain/schemas/dto/request/create.user.request';
import { UpdateUserRequest } from '../../domain/schemas/dto/request/update.user.request';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('find-all')
  @ApiOperation({
    summary: 'Method GET - Find all users ✅',
    description: 'Retrieves a list of all users in the system.',
  })
  @MessagePattern('user.find-all')
  async findAll() {
    console.log(`'Finding all users'`);
    return this.userService.findAll();
  }

  @Get('find-by-id/:idUser')
  @ApiOperation({
    summary: 'Method GET - Find user by ID ✅',
    description: 'Retrieves a user by its ID.',
  })
  @MessagePattern('user.find-by-id')
  async findById(@Payload('idUser') idUser: number) {
    return this.userService.findById(idUser);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Method POST - Create a new user ✅',
    description: 'Creates a new user in the system.',
  })
  @MessagePattern('user.create')
  async create(@Payload() userRequest: CreateUserRequest) {
    return this.userService.create(userRequest);
  }

  @Put('update/:idUser')
  @ApiOperation({
    summary: 'Method PUT - Update user by ID ✅',
    description: 'Updates an existing user by its ID.',
  })
  @MessagePattern('user.update')
  async update(
    @Payload()
    payload: {
      idUser: number;
      userRequest: UpdateUserRequest;
    },
  ) {
    const { idUser, userRequest } = payload;
    return this.userService.update(idUser, userRequest);
  }

  @Delete('delete/:idUser')
  @ApiOperation({
    summary: 'Method DELETE - Delete user by ID ✅',
    description: 'Deletes a user by its ID.',
  })
  @MessagePattern('user.delete')
  async delete(@Payload('idUser') idUser: number) {
    return this.userService.delete(idUser);
  }

  @Get('find-by-email/:userEmail')
  @ApiOperation({
    summary: 'Method GET - Find user by email ✅',
    description: 'Retrieves a user by its email address.',
  })
  @MessagePattern('user.find-by-email')
  async findByEmail(@Payload('userEmail') userEmail: string) {
    return this.userService.findByEmail(userEmail);
  }
}
