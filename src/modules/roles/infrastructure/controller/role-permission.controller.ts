import { Controller, Get, Post, Put, Delete } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolePermissionService } from '../../application/services/role-permission.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateRolePermissionRequest } from '../../domain/schemas/dto/request/create.role-permission.request';
import { UpdateRolePermissionRequest } from '../../domain/schemas/dto/request/update.role-permission.request';

@Controller('role-permission')
@ApiTags('role-permission')
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Get('find-all')
  @ApiOperation({
    summary: 'Method GET - Find All Role Permissions ✅',
    description:
      'This endpoint retrieves all role permissions from the system.',
  })
  @MessagePattern('role-permission.find-all')
  async findAllRolePermissions() {
    return this.rolePermissionService.findAllRolePermissions();
  }

  @Post('create')
  @ApiOperation({
    summary: 'Method POST - Create Role Permission ✅',
    description: 'This endpoint creates a new role permission in the system.',
  })
  @MessagePattern('role-permission.create')
  async createRolePermission(
    @Payload() rolePermissionRequest: CreateRolePermissionRequest,
  ) {
    return this.rolePermissionService.createRolePermission(
      rolePermissionRequest,
    );
  }

  @Put('update/:idRolePermission')
  @ApiOperation({
    summary: 'Method PUT - Update Role Permission by ID ✅',
    description: 'This endpoint updates an existing role permission by its ID.',
  })
  @MessagePattern('role-permission.update')
  async updateRolePermission(
    @Payload()
    payload: {
      idRolePermission: number;
      rolePermissionRequest: UpdateRolePermissionRequest;
    },
  ) {
    const { idRolePermission, rolePermissionRequest } = payload;
    return this.rolePermissionService.updateRolePermission(
      idRolePermission,
      rolePermissionRequest,
    );
  }

  @Delete('delete/:idRolePermission')
  @ApiOperation({
    summary: 'Method DELETE - Delete Role Permission by ID ✅',
    description: 'This endpoint deletes a role permission by its ID.',
  })
  @MessagePattern('role-permission.delete')
  async deleteRolePermission(
    @Payload('idRolePermission') idRolePermission: number,
  ) {
    return this.rolePermissionService.deleteRolePermission(idRolePermission);
  }

  @Get('find-by-id/:idRolePermission')
  @ApiOperation({
    summary: 'Method GET - Find Role Permission by ID ✅',
    description: 'This endpoint retrieves a role permission by its ID.',
  })
  @MessagePattern('role-permission.find-by-id')
  async findRolePermissionById(
    @Payload('idRolePermission') idRolePermission: number,
  ) {
    return this.rolePermissionService.findRolePermissionById(idRolePermission);
  }

  @Get('find-by-user-type-id/:userTypeId')
  @ApiOperation({
    summary: 'Method GET - Find Role Permissions by User Type ID ✅',
    description:
      'This endpoint retrieves role permissions associated with a specific user type ID.',
  })
  @MessagePattern('role-permission.find-by-user-type-id')
  async findRolePermissionsByUserTypeId(
    @Payload('userTypeId') userTypeId: number,
  ) {
    return this.rolePermissionService.findRolePermissionsByUserTypeId(
      userTypeId,
    );
  }

  @Get('find-by-permission-id/:permissionId')
  @ApiOperation({
    summary: 'Method GET - Find Role Permissions by Permission ID ✅',
    description:
      'This endpoint retrieves role permissions associated with a specific permission ID.',
  })
  @MessagePattern('role-permission.find-by-permission-id')
  async findRolePermissionsByPermissionId(
    @Payload('permissionId') permissionId: number,
  ) {
    return this.rolePermissionService.findRolePermissionsByPermissionId(
      permissionId,
    );
  }
}
