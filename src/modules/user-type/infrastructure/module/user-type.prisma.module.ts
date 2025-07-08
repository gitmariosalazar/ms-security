import { Module } from '@nestjs/common';
import { UserTypeController } from '../controller/user-type.controller';
import { UserTypeService } from '../../application/services/user-type.service';
import { PrismaService } from 'src/shared/prisma/service/prisma.service';
import { UserTypePrismaImplementation } from '../repositories/prisma/persistence/prisma.user-type.persistence';

@Module({
  imports: [],
  controllers: [UserTypeController],
  providers: [
    PrismaService,
    UserTypeService,
    {
      provide: 'UserTypeRepository',
      useClass: UserTypePrismaImplementation,
    },
  ],
  exports: [],
})
export class UserTypeModuleUsingPrisma {}
