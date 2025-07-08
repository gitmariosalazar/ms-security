import { Module } from '@nestjs/common';
import { UserTypeController } from '../controller/user-type.controller';
import { UserTypeService } from '../../application/services/user-type.service';
import { UserTypeMySQLImplementation } from '../repositories/mysql/persistence/mysql.user-type.persistence';
import { DatabaseServiceMySQL } from 'src/shared/connections/database/mysql/mysql.service';

@Module({
  imports: [],
  controllers: [UserTypeController],
  providers: [
    UserTypeService,
    DatabaseServiceMySQL,
    {
      provide: 'UserTypeRepository',
      useClass: UserTypeMySQLImplementation,

    },
  ],
  exports: [],
})
export class UserTypeModuleUsingMySQL {}
