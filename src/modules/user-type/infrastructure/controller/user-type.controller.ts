import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserTypeService } from '../../application/services/user-type.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserTypeRequest } from '../../domain/schemas/dto/request/create.user-type.request';
import { UpdateUserTypeRequest } from '../../domain/schemas/dto/request/update.user-type.request';

@Controller('user-type')
@ApiTags('User Type')
export class UserTypeController {
  constructor(private readonly userTypeService: UserTypeService) {}

  @Get(`find-all`)
  @ApiOperation({
    summary: 'Method GET - Find all user types ✅',
    description: 'Retrieves a list of all user types in the system.',
  })
  @MessagePattern('user-type.find-all')
  async findAll() {
    console.log(`Request received for user-type.find-all`);
    console.log(`Processing request to find all user types`);
    return this.userTypeService.findAll();
  }

  @Get(`find-by-id/:idUserType`)
  @ApiOperation({
    summary: 'Method GET - Find user type by ID ✅',
    description: 'Retrieves a user type by its ID.',
  })
  @MessagePattern('user-type.find-by-id')
  async findById(@Payload('idUserType') idUserType: number) {
    return await this.userTypeService.findById(idUserType);
  }

  @Post(`create`)
  @ApiOperation({
    summary: 'Method POST - Create a new user type ✅',
    description: 'Creates a new user type in the system.',
  })
  @MessagePattern('user-type.create')
  async create(@Payload() userTypeRequest: CreateUserTypeRequest) {
    return this.userTypeService.create(userTypeRequest);
  }

  @Put(`update/:idUserType`)
  @ApiOperation({
    summary: 'Method PUT - Update user type by ID ✅',
    description: 'Updates an existing user type by its ID.',
  })
  @MessagePattern('user-type.update')
  async update(
    @Payload()
    payload: {
      idUserType: number;
      userTypeRequest: UpdateUserTypeRequest;
    },
  ) {
    const { idUserType, userTypeRequest } = payload;
    return this.userTypeService.update(idUserType, userTypeRequest);
  }

  @Delete(`delete/:idUserType`)
  @ApiOperation({
    summary: 'Method DELETE - Delete user type by ID ✅',
    description: 'Deletes a user type by its ID.',
  })
  @MessagePattern('user-type.delete')
  async delete(@Payload('idUserType') idUserType: number) {
    return this.userTypeService.delete(idUserType);
  }

  @Get(`find-by-name/:name`)
  @ApiOperation({
    summary: 'Method GET - Find user type by name ✅',
    description: 'Retrieves a user type by its name.',
  })
  @MessagePattern('user-type.find-by-name')
  async findByName(@Payload('name') name: string) {
    return this.userTypeService.findByName(name);
  }

  @Get(`find-like-name/:name`)
  @ApiOperation({
    summary: 'Method GET - Find user types like name ✅',
    description: 'Retrieves user types that match a given name pattern.',
  })
  @MessagePattern('user-type.find-like-name')
  async findLikeName(@Payload('name') name: string) {
    return this.userTypeService.findLikeName(name);
  }
}
