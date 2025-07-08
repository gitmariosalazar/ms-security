import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PermissionService } from '../../application/services/permission.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreatePermissionRequest } from '../../domain/schemas/dto/request/create.permission.request';
import { UpdatePermissionRequest } from '../../domain/schemas/dto/request/update.permission.request';

@Controller('permission')
@ApiTags('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get('find-all')
  @ApiOperation({
    summary: 'Method GET - Find all permissions ✅',
    description: 'Retrieves a list of all permissions in the system.',
  })
  @MessagePattern( 'permission.find-all')
  async findAll() {
    return this.permissionService.findAll();
  }

  @Get('find-by-id/:idPermission')
  @ApiOperation({
    summary: 'Method GET - Find permission by ID ✅',
    description: 'Retrieves a permission by its ID.',
  })
  @MessagePattern( 'permission.find-by-id')
  async findById(@Payload('idPermission') idPermission: number) {
    return this.permissionService.findById(idPermission);
  }

  @Get(`find-by-name/:name`)
  @ApiOperation({
    summary: 'Method GET - Find permission by name ✅',
    description: 'Retrieves a permission by its name.',
  })
  @MessagePattern( 'permission.find-by-name')
  async findByName(@Payload('name') name: string) {
    return this.permissionService.findByName(name);
  }

  @Post('create')
  @ApiOperation({
    summary: 'Method POST - Create a new permission ✅',
    description: 'Creates a new permission in the system.',
  })
  @MessagePattern( 'permission.create')
  async create(@Payload() permissionRequest: CreatePermissionRequest) {
    return this.permissionService.create(permissionRequest);
  }

  @Put('update/:idPermission')
  @ApiOperation({
    summary: 'Method PUT - Update permission by ID ✅',
    description: 'Updates an existing permission by its ID.',
  })
  @MessagePattern( 'permission.update')
  async update(
    @Payload()
    payload: {
      idPermission: number;
      permissionRequest: UpdatePermissionRequest;
    },
  ) {
    const { idPermission, permissionRequest } = payload;
    return this.permissionService.update(idPermission, permissionRequest);
  }

  @Delete('delete/:idPermission')
  @ApiOperation({
    summary: 'Method DELETE - Delete permission by ID ✅',
    description: 'Deletes a permission by its ID.',
  })
  @MessagePattern( 'permission.delete')
  async delete(@Payload('idPermission') idPermission: number) {
    return this.permissionService.delete(idPermission);
  }
}
