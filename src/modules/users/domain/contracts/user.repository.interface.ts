import { UserResponse } from '../schemas/dto/response/user.response';
import { UserModel } from '../schemas/model/user.model';

export interface InterfaceUserRepository {
  create(userModel: UserModel): Promise<UserResponse | null>;
  update(idUser: string, userModel: UserModel): Promise<UserResponse | null>;
  findById(idUser: string): Promise<UserResponse | null>;
  findByEmail(userEmail: string): Promise<UserResponse | null>;
  findAll(): Promise<UserResponse[]>;
  delete(idUser: string): Promise<boolean>;
}
