import { Module } from "@nestjs/common";
import { PermissionController } from "../controller/permission.controller";
import { PrismaService } from "src/shared/prisma/service/prisma.service";
import { PermissionService } from "../../application/services/permission.service";
import { PermissionPrismaImplementation } from "../repositories/prisma/persistence/prisma.permission.persistence";

@Module({
  imports: [],
  controllers: [
    PermissionController
  ],
  providers: [
    PrismaService,
    PermissionService,
    {
      provide: 'PermissionRepository',
      useClass: PermissionPrismaImplementation
    }
  ],
  exports: [],
})
export class PermissionModuleUsingPrisma {}