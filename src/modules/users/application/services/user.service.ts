import { Inject, Injectable } from '@nestjs/common';
import { InterfaceUserUseCaseService } from '../usecases/user.use-case.interface';
import { InterfaceUserRepository } from '../../domain/contracts/user.repository.interface';
import { CreateUserRequest } from '../../domain/schemas/dto/request/create.user.request';
import { UserResponse } from '../../domain/schemas/dto/response/user.response';
import { UserModel } from '../../domain/schemas/model/user.model';
import { UserMapper } from '../mapper/user.mapper';
import { validateFields } from 'src/shared/utils/validators/fields.validators';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from 'src/settings/environments/status-code';
import { InterfaceUserTypeRepository } from 'src/modules/user-type/domain/contracts/user-type.repository.interface';
import { UserTypeResponse } from 'src/modules/user-type/domain/schemas/dto/response/user-type.response';
import { UserTypeModel } from 'src/modules/user-type/domain/schemas/model/user-type.model';
@Injectable()
export class UserService implements InterfaceUserUseCaseService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: InterfaceUserRepository,

    @Inject('UserTypeRepository')
    private readonly userTypeRepository: InterfaceUserTypeRepository,
  ) {}

  async create(userRequest: CreateUserRequest): Promise<UserResponse | null> {
    try {
      const requiredFields: string[] = [
        'userEmail',
        'userPassword',
        'firstName',
        'lastName',
      ];

      const missingFieldsMessages: string[] = validateFields(
        userRequest,
        requiredFields,
      );

      if (missingFieldsMessages.length > 0) {
        throw new RpcException({
          statusCode: statusCode.BAD_REQUEST,
          message: missingFieldsMessages,
        });
      }

      const userType: UserTypeResponse = await this.userTypeRepository.findById(
        userRequest.userTypeId,
      );

      if (!userType) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `User type with ID ${userRequest.userTypeId} not found.`,
        });
      }

      const userTypeModel: UserTypeModel = new UserTypeModel(
        userType.idUserType,
        userType.name,
        userType.description,
      );

      const userModel: UserModel = UserMapper.fromCreateUserRequestToUserModel(
        userRequest,
        userTypeModel,
      );
      return await this.userRepository.create(userModel);
    } catch (error) {
      throw error;
    }
  }

  async update(
    idUser: number,
    userRequest: CreateUserRequest,
  ): Promise<UserResponse | null> {
    if (!idUser || isNaN(idUser)) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'ID is required to update a user.',
      });
    }

    const requiredFields: string[] = ['userEmail', 'firstName', 'lastName'];
    const missingFieldsMessages: string[] = validateFields(
      userRequest,
      requiredFields,
    );

    if (missingFieldsMessages.length > 0) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: missingFieldsMessages,
      });
    }
    const userType: UserTypeResponse = await this.userTypeRepository.findById(
      userRequest.userTypeId,
    );

    if (!userType) {
      throw new RpcException({
        statusCode: statusCode.NOT_FOUND,
        message: `User type with ID ${userRequest.userTypeId} not found.`,
      });
    }

    const userTypeModel: UserTypeModel = new UserTypeModel(
      userType.idUserType,
      userType.name,
      userType.description,
    );

    const userModel: UserModel = UserMapper.fromUpdateUserRequestToUserModel(
      userRequest,
      userTypeModel,
    );
    return await this.userRepository.update(idUser, userModel);
  }

  async findById(idUser: number): Promise<UserResponse | null> {
    if (!idUser || isNaN(idUser)) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'ID is required to find a user.',
      });
    }
    return await this.userRepository.findById(idUser);
  }

  async findByEmail(userEmail: string): Promise<UserResponse | null> {
    if (!userEmail) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'Email is required to find a user.',
      });
    }
    return await this.userRepository.findByEmail(userEmail);
  }

  async findAll(): Promise<UserResponse[]> {
    return await this.userRepository.findAll();
  }

  async delete(idUser: number): Promise<boolean> {
    if (!idUser || isNaN(idUser)) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'ID is required to delete a user.',
      });
    }
    return await this.userRepository.delete(idUser);
  }
}
