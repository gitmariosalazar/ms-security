import { Inject, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InterfaceUserTypeRepository } from 'src/modules/user-type/domain/contracts/user-type.repository.interface';
import { statusCode } from 'src/settings/environments/status-code';
import { validateFields } from 'src/shared/utils/validators/fields.validators';
import { InterfaceUserRepository } from '../../domain/contracts/user.repository.interface';
import { CreateUserRequest } from '../../domain/schemas/dto/request/create.user.request';
import { UserResponse } from '../../domain/schemas/dto/response/user.response';
import { UserModel } from '../../domain/schemas/model/user.model';
import { UserMapper } from '../mapper/user.mapper';
import { InterfaceUserUseCaseService } from '../usecases/user.use-case.interface';
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

      const userModel: UserModel =
        UserMapper.fromCreateUserRequestToUserModel(userRequest);
      return await this.userRepository.create(userModel);
    } catch (error) {
      throw error;
    }
  }

  async update(
    idUser: string,
    userRequest: CreateUserRequest,
  ): Promise<UserResponse | null> {
    if (!idUser || idUser.trim() === '') {
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

    const userModel: UserModel =
      UserMapper.fromUpdateUserRequestToUserModel(userRequest);
    return await this.userRepository.update(idUser, userModel);
  }

  async findById(idUser: string): Promise<UserResponse | null> {
    if (!idUser || idUser.trim() === '') {
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

  async delete(idUser: string): Promise<boolean> {
    if (!idUser || idUser.trim() === '') {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'ID is required to delete a user.',
      });
    }
    return await this.userRepository.delete(idUser);
  }
}
