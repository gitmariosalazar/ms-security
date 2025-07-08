import { Inject, Injectable } from '@nestjs/common';
import { InterfaceUserTypeRepository } from '../../domain/contracts/user-type.repository.interface';
import { CreateUserTypeRequest } from '../../domain/schemas/dto/request/create.user-type.request';
import { UserTypeResponse } from '../../domain/schemas/dto/response/user-type.response';
import { UserTypeModel } from '../../domain/schemas/model/user-type.model';
import { UserTypeMapper } from '../mappers/user-type.mapper';
import { InterfaceUserTypeUseCaseService } from '../usecases/user-type.use-case.interface';
import { validateFields } from 'src/shared/utils/validators/fields.validators';
import { RpcException } from '@nestjs/microservices';
import { statusCode } from 'src/settings/environments/status-code';
import { UpdateUserTypeRequest } from '../../domain/schemas/dto/request/update.user-type.request';

@Injectable()
export class UserTypeService implements InterfaceUserTypeUseCaseService {
  constructor(
    @Inject('UserTypeRepository')
    private readonly userTypeRepository: InterfaceUserTypeRepository,
  ) {}
  /**
   * Creates a new user type.
   * @param {CreateUserTypeRequest} userTypeRequest - The user type to create.
   * @returns {Promise<UserTypeResponse | null>} The created user type or null if creation failed.
   */
  create(
    userTypeRequest: CreateUserTypeRequest,
  ): Promise<UserTypeResponse | null> {
    const requiredFields: string[] = ['name', 'description'];
    const missingFieldsMessages: string[] = validateFields(
      userTypeRequest,
      requiredFields,
    );
    if (missingFieldsMessages.length > 0) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: missingFieldsMessages,
      });
    }

    const userTypeModel: UserTypeModel =
      UserTypeMapper.fromUserTypeRequestToUserTypeModel(userTypeRequest);
    return this.userTypeRepository.create(userTypeModel);
  }

  /**
   * Updates an existing user type by its ID.
   * @param {number} idUserType - The ID of the user type to update.
   * @param {CreateUserTypeRequest} userTypeRequest - The updated user type data.
   * @returns {Promise<UserTypeResponse | null>} The updated user type or null if the update failed.
   */
  update(
    idUserType: number,
    userTypeRequest: UpdateUserTypeRequest,
  ): Promise<UserTypeResponse | null> {
    if (!idUserType || isNaN(idUserType)) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'ID is required to update a user type.',
      });
    }
    const requiredFields: string[] = ['name', 'description'];
    const missingFieldsMessages: string[] = validateFields(
      userTypeRequest,
      requiredFields,
    );

    if (missingFieldsMessages.length > 0) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: missingFieldsMessages,
      });
    }

    const userTypeModel: UserTypeModel =
      UserTypeMapper.fromUserTypeRequestToUserTypeModel(userTypeRequest);
    return this.userTypeRepository.update(idUserType, userTypeModel);
  }

  /**
   * Deletes a user type by its ID.
   * @param {string} idUserType - The ID of the user type to delete.
   * @returns {Promise<boolean>} True if the user type was deleted, false otherwise.
   */
  delete(idUserType: number): Promise<boolean> {
    if (!idUserType || isNaN(idUserType)) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'ID is required to delete a user type.',
      });
    }
    return this.userTypeRepository.delete(idUserType);
  }

  /**
   * Finds a user type by its ID.
   * @param {number} idUserType - The ID of the user type to find.
   * @returns {Promise<UserTypeResponse | null>} The found user type or null if not found.
   */
  findById(idUserType: number): Promise<UserTypeResponse | null> {
    if (!idUserType || isNaN(idUserType)) {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'ID is required to find a user type.',
      });
    }
    return this.userTypeRepository.findById(idUserType);
  }

  /**
   * Finds all user types.
   * @returns {Promise<UserTypeResponse[]>} An array of all user types.
   */
  findAll(): Promise<UserTypeResponse[]> {
    return this.userTypeRepository.findAll();
  }

  /**
   * Finds a user type by its name.
   * @param {string} name - The name of the user type to find.
   * @returns {Promise<UserTypeResponse | null>} The found user type or null if not found.
   */
  findByName(name: string): Promise<UserTypeResponse | null> {
    if (!name || name.trim() === '') {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'Name is required to find a user type.',
      });
    }
    return this.userTypeRepository.findByName(name);
  }

  /**
   * Finds user types that match a given name pattern.
   * @param {string} name - The name pattern to search for.
   * @returns {Promise<UserTypeResponse[]>} An array of user types that match the name pattern.
   */
  findLikeName(name: string): Promise<UserTypeResponse[]> {
    if (!name || name.trim() === '') {
      throw new RpcException({
        statusCode: statusCode.BAD_REQUEST,
        message: 'Name is required to find user types.',
      });
    }
    return this.userTypeRepository.findLikeName(name);
  }
}
