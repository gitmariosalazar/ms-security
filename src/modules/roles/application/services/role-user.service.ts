import { Inject, Injectable } from '@nestjs/common';
import { InterfaceRoleUserRepository } from '../../domain/contracts/role-user.repository.interface';
import { InterfaceUserTypeRepository } from 'src/modules/user-type/domain/contracts/user-type.repository.interface';
import { InterfaceUserRepository } from 'src/modules/users/domain/contracts/user.repository.interface';
import { InterfaceRoleUserUseCase } from '../usecases/role-user.use-case.interface';
import { CreateRoleUserRequest } from '../../domain/schemas/dto/request/create.role-user.request';
import { RoleUserResponse } from '../../domain/schemas/dto/response/role-user.response';
import { validateFields } from 'src/shared/utils/validators/fields.validators';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from 'src/settings/environments/status-code';
import { UserResponse } from 'src/modules/users/domain/schemas/dto/response/user.response';
import { UserTypeResponse } from 'src/modules/user-type/domain/schemas/dto/response/user-type.response';
import { UserModel } from 'src/modules/users/domain/schemas/model/user.model';
import { UserMapper } from 'src/modules/users/application/mapper/user.mapper';
import { UserTypeModel } from 'src/modules/user-type/domain/schemas/model/user-type.model';
import { UserTypeMapper } from 'src/modules/user-type/application/mappers/user-type.mapper';
import { RoleUserModel } from '../../domain/schemas/model/role-users.model';
import { RoleUserMapper } from '../mapper/role-user.mapper';
import { UpdateRoleUserRequest } from '../../domain/schemas/dto/request/update.role-user.request';

@Injectable()
export class RoleUserService implements InterfaceRoleUserUseCase {
  constructor(
    @Inject(`RoleUserRepository`)
    private readonly roleUserRepository: InterfaceRoleUserRepository,
    @Inject('UserTypeRepository')
    private readonly userTypeRepository: InterfaceUserTypeRepository,
    @Inject('UserRepository')
    private readonly userRepository: InterfaceUserRepository,
  ) {}

  async createRoleUser(
    roleUser: CreateRoleUserRequest,
  ): Promise<RoleUserResponse | null> {
    try {
      const requiredFields: string[] = ['idUser', 'idUserType'];
      const missingFieldMessages: string[] = validateFields(
        roleUser,
        requiredFields,
      );
      if (missingFieldMessages.length > 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: missingFieldMessages,
        });
      }
      const userFound: UserResponse | null = await this.userRepository.findById(
        roleUser.idUser,
      );
      if (!userFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `User with ID ${roleUser.idUser} not found`,
        });
      }
      const userTypeFound: UserTypeResponse | null =
        await this.userTypeRepository.findById(roleUser.idUserType);
      if (!userTypeFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `UserType with ID ${roleUser.idUserType} not found`,
        });
      }

      const userModel: UserModel =
        UserMapper.fromUserResponseToUserModel(userFound);

      const userTypeModel: UserTypeModel =
        UserTypeMapper.fromUserTypeResponseToUserTypeModel(userTypeFound);

      const roleUserModel: RoleUserModel =
        RoleUserMapper.fromCreateRoleUserRequestToRoleUserModel(
          roleUser,
          userModel,
          userTypeModel,
        );

      const roleUserCreated: RoleUserResponse | null =
        await this.roleUserRepository.create(roleUserModel);

      if (!roleUserCreated) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Error creating RoleUser',
        });
      }

      return roleUserCreated;
    } catch (error) {
      throw error;
    }
  }

  async updateRoleUser(
    idRoleUser: number,
    roleUser: UpdateRoleUserRequest,
  ): Promise<RoleUserResponse | null> {
    try {
      if (idRoleUser <= 0 || isNaN(idRoleUser)) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: `Invalid RoleUser ID`,
        });
      }

      const roleUserFound: RoleUserResponse | null =
        await this.roleUserRepository.findById(idRoleUser);
      if (!roleUserFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `RoleUser with ID ${idRoleUser} not found`,
        });
      }

      const requiredFields: string[] = ['idUser', 'idUserType'];
      const missingFieldMessages: string[] = validateFields(
        roleUser,
        requiredFields,
      );
      if (missingFieldMessages.length > 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: missingFieldMessages,
        });
      }

      const userFound: UserResponse | null = await this.userRepository.findById(
        roleUser.idUser,
      );
      if (!userFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `User with ID ${roleUser.idUser} not found`,
        });
      }

      const userTypeFound: UserTypeResponse | null =
        await this.userTypeRepository.findById(roleUser.idUserType);
      if (!userTypeFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `UserType with ID ${roleUser.idUserType} not found`,
        });
      }

      const userModel: UserModel =
        UserMapper.fromUserResponseToUserModel(userFound);
      const userTypeModel: UserTypeModel =
        UserTypeMapper.fromUserTypeResponseToUserTypeModel(userTypeFound);

      const roleUserModel: RoleUserModel =
        RoleUserMapper.fromUpdateRoleUserRequestToRoleUserModel(
          roleUser,
          userModel,
          userTypeModel,
        );
      const roleUserUpdated: RoleUserResponse | null =
        await this.roleUserRepository.update(idRoleUser, roleUserModel);
      if (!roleUserUpdated) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Error updating RoleUser',
        });
      }

      return roleUserUpdated;
    } catch (error) {
      throw error;
    }
  }

  async findRoleUserById(idRoleUser: number): Promise<RoleUserResponse | null> {
    try {
      if (idRoleUser <= 0 || isNaN(idRoleUser)) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: `Invalid RoleUser ID`,
        });
      }

      const roleUserFound: RoleUserResponse | null =
        await this.roleUserRepository.findById(idRoleUser);
      if (!roleUserFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `RoleUser with ID ${idRoleUser} not found`,
        });
      }

      return roleUserFound;
    } catch (error) {
      throw error;
    }
  }

  async findAllRoleUsers(): Promise<RoleUserResponse[]> {
    try {
      const roleUsers: RoleUserResponse[] =
        await this.roleUserRepository.findAll();
      if (!roleUsers || roleUsers.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No RoleUsers found',
        });
      }
      return roleUsers;
    } catch (error) {
      throw error;
    }
  }

  async findRoleUserByUserIdAndRoleId(
    idUser: string,
    idRole: number,
  ): Promise<RoleUserResponse | null> {
    try {
      if (!idUser || !idRole || isNaN(idRole)) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: 'User ID and Role ID are required',
        });
      }

      const roleUserFound: RoleUserResponse | null =
        await this.roleUserRepository.findByUserIdAndRoleId(idUser, idRole);
      if (!roleUserFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `RoleUser with User ID ${idUser} and Role ID ${idRole} not found`,
        });
      }

      return roleUserFound;
    } catch (error) {
      throw error;
    }
  }

  async deleteRoleUser(idRoleUser: number): Promise<boolean> {
    try {
      if (idRoleUser <= 0 || isNaN(idRoleUser)) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: `Invalid RoleUser ID`,
        });
      }

      const roleUserFound: RoleUserResponse | null =
        await this.roleUserRepository.findById(idRoleUser);
      if (!roleUserFound) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `RoleUser with ID ${idRoleUser} not found`,
        });
      }

      const deleted: boolean = await this.roleUserRepository.delete(idRoleUser);
      if (!deleted) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Error deleting RoleUser',
        });
      }

      return true;
    } catch (error) {
      throw error;
    }
  }
}
