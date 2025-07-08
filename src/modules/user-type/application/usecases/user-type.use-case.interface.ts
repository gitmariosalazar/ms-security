import { CreateUserTypeRequest } from '../../domain/schemas/dto/request/create.user-type.request';
import { UpdateUserTypeRequest } from '../../domain/schemas/dto/request/update.user-type.request';
import { UserTypeResponse } from '../../domain/schemas/dto/response/user-type.response';

export interface InterfaceUserTypeUseCaseService {
  /**
   * Creates a new user type.
   * @param {CreateUserTypeRequest} userTypeRequest - The user type to create.
   * @returns {Promise<UserTypeResponse | null>} The created user type or null if creation failed.
   */
  create(
    userTypeRequest: CreateUserTypeRequest,
  ): Promise<UserTypeResponse | null>;

  /**
   * Updates an existing user type by its ID.
   * @param {number} idUserType - The ID of the user type to update.
   * @param {CreateUserTypeRequest} userTypeRequest - The updated user type data.
   * @returns {Promise<UserTypeResponse | null>} The updated user type or null if the update failed.
   */
  update(
    idUserType: number,
    userTypeRequest: UpdateUserTypeRequest,
  ): Promise<UserTypeResponse | null>;

  /**
   * Deletes a user type by its ID.
   * @param {string} idUserType - The ID of the user type to delete.
   * @returns {Promise<boolean>} True if the user type was deleted, false otherwise.
   */
  delete(idUserType: number): Promise<boolean>;

  /**
   * Finds a user type by its ID.
   * @param {number} idUserType - The ID of the user type to find.
   * @returns {Promise<UserTypeResponse | null>} The found user type or null if not found.
   */
  findById(idUserType: number): Promise<UserTypeResponse | null>;

  /**
   * Finds all user types.
   * @returns {Promise<UserTypeResponse[]>} An array of all user types.
   */
  findAll(): Promise<UserTypeResponse[]>;

  /**
   * Finds a user type by its name.
   * @param {string} name - The name of the user type to find.
   * @returns {Promise<UserTypeResponse | null>} The found user type or null if not found.
   */
  findByName(name: string): Promise<UserTypeResponse | null>;

  /**
   * Finds user types that match a given name pattern.
   * @param {string} name - The name pattern to search for.
   * @returns {Promise<UserTypeResponse[]>} An array of user types that match the name pattern.
   */
  findLikeName(name: string): Promise<UserTypeResponse[]>;
}
