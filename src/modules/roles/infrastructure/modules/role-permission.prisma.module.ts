import { Module } from '@nestjs/common';
import { RolePermissionController } from '../controller/role-permission.controller';
import { PrismaService } from 'src/shared/prisma/service/prisma.service';
import { RolePermissionService } from '../../application/services/role-permission.service';
import { RolePermissionPrismaImplementation } from '../repositories/prisma/persistence/prisma.role-permission.persistence';
import { UserTypePrismaImplementation } from 'src/modules/user-type/infrastructure/repositories/prisma/persistence/prisma.user-type.persistence';
import { PermissionPrismaImplementation } from 'src/modules/permission/infrastructure/repositories/prisma/persistence/prisma.permission.persistence';

@Module({
  imports: [],
  controllers: [RolePermissionController],
  providers: [
    PrismaService,
    RolePermissionService,
    {
      provide: 'RolePermissionRepository',
      useClass: RolePermissionPrismaImplementation,
    },
    {
      provide: 'PermissionRepository',
      useClass: PermissionPrismaImplementation
    },
    {
      provide: 'UserTypeRepository',
      useClass: UserTypePrismaImplementation,
    },
  ],
  exports: [],
})
export class RolePermissionModuleUsingPrisma {}
