import { CreateUserRequest } from '../../domain/schemas/dto/request/create.user.request';
import { UpdateUserRequest } from '../../domain/schemas/dto/request/update.user.request';
import { UserResponse } from '../../domain/schemas/dto/response/user.response';

export interface InterfaceUserUseCaseService {
  create(userRequest: CreateUserRequest): Promise<UserResponse | null>;
  update(
    idUser: number,
    userRequest: UpdateUserRequest,
  ): Promise<UserResponse | null>;
  findById(idUser: number): Promise<UserResponse | null>;
  findByEmail(userEmail: string): Promise<UserResponse | null>;
  findAll(): Promise<UserResponse[]>;
}
