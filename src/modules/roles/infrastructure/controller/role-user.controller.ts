import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleUserService } from '../../application/services/role-user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateRoleUserRequest } from '../../domain/schemas/dto/request/create.role-user.request';

@Controller('role-user')
@ApiTags('role-user')
export class RoleUserController {
  constructor(private readonly roleUserService: RoleUserService) {}

  @Post()
  @ApiOperation({
    summary: 'Method POST - Create a new role-user ✅',
    description: 'Creates a new role-user association',
  })
  @MessagePattern('role-user.create')
  async create(@Payload() roleUser: CreateRoleUserRequest) {
    return this.roleUserService.createRoleUser(roleUser);
  }

  @Put('update/:idRoleUser')
  @ApiOperation({
    summary: 'Method PUT - Update an existing role-user ✅',
    description: 'Updates an existing role-user association',
  })
  @MessagePattern('role-user.update')
  async update(
    @Payload() payload: { idRoleUser: number; roleUser: CreateRoleUserRequest },
  ) {
    const { idRoleUser, roleUser } = payload;
    return this.roleUserService.updateRoleUser(idRoleUser, roleUser);
  }

  @Get('find-all')
  @ApiOperation({
    summary: 'Method GET - Find all role-user associations ✅',
    description: 'Retrieves all role-user associations',
  })
  @MessagePattern('role-user.find-all')
  async findAll() {
    return this.roleUserService.findAllRoleUsers();
  }

  @Delete('delete/:idRoleUser')
  @ApiOperation({
    summary: 'Method DELETE - Delete a role-user association ✅',
    description: 'Deletes a role-user association',
  })
  @MessagePattern('role-user.delete')
  async delete(@Payload('idRoleUser') idRoleUser: number) {
    return this.roleUserService.deleteRoleUser(idRoleUser);
  }

  @Get('find-by-id/:idRoleUser')
  @ApiOperation({
    summary: 'Method GET - Find a role-user association by ID ✅',
    description: 'Retrieves a role-user association by its ID',
  })
  @MessagePattern('role-user.find-by-id')
  async findById(@Payload('idRoleUser') idRoleUser: number) {
    return this.roleUserService.findRoleUserById(idRoleUser);
  }

  @Get('find-by-user-and-by-user-type/:idUser/:userType')
  @ApiOperation({
    summary:
      'Method GET - Find role-user associations by user and user type ✅',
    description: 'Retrieves role-user associations by user ID and user type',
  })
  @MessagePattern('role-user.find-by-user-and-by-user-type')
  async findByUserAndUserType(
    @Payload() payload: { idUser: string; idUserType: number },
  ) {
    return this.roleUserService.findRoleUserByUserIdAndRoleId(
      payload.idUser,
      payload.idUserType,
    );
  }
}
