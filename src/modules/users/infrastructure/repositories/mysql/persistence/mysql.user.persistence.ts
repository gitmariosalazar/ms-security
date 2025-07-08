import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InterfaceUserRepository } from 'src/modules/users/domain/contracts/user.repository.interface';
import { UserResponse } from 'src/modules/users/domain/schemas/dto/response/user.response';
import { UserModel } from 'src/modules/users/domain/schemas/model/user.model';
import { statusCode } from 'src/settings/environments/status-code';
import { DatabaseServiceMySQL } from 'src/shared/connections/database/mysql/mysql.service';
import { UserAdapter } from '../../../adapters/user.adapter';
import { UserResponseSql } from 'src/shared/sql/interface/response/user.response.sql';
import { UserTypeModel } from 'src/modules/user-type/domain/schemas/model/user-type.model';

@Injectable()
export class UserMySQLImplementation implements InterfaceUserRepository {
  constructor(private readonly mysqlService: DatabaseServiceMySQL) {}

  async create(userModel: UserModel): Promise<UserResponse | null> {
    try {
      const userFound = await this.mysqlService.query(
        'SELECT * FROM users WHERE user_email = ?',
        [userModel.getUserEmail()],
      );

      if (userFound.length > 0) {
        throw new RpcException({
          statusCode: statusCode.CONFLICT,
          message: `User with email "${userModel.getUserEmail()}" already exists.`,
        });
      }

      const query: string = `
        INSERT INTO users (user_email, user_password, first_name, last_name, id_user_type, updated_at)
        VALUES (?, ?, ?, ?, ?, NOW())
        RETURNING id_user, user_email, first_name, last_name, created_at, updated_at, user_active;
      `;
      const params = [
        userModel.getUserEmail(),
        userModel.getUserPassword(),
        userModel.getFirstName(),
        userModel.getLastName(),
        userModel.getUserType().getIdUserType(),
      ];
      const result = await this.mysqlService.query(query, params);
      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to create user.',
        });
      }
      const user = result[0];
      userModel.setIdUser(user.id_user);
      const userResponse: UserResponse =
        UserAdapter.fromUserModelToUserResponse(userModel);
      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  async update(
    idUser: number,
    userModel: UserModel,
  ): Promise<UserResponse | null> {
    try {
      const userFound = await this.mysqlService.query(
        'SELECT * FROM users WHERE id_user = ?',
        [idUser],
      );

      if (userFound.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `User with ID "${idUser}" not found.`,
        });
      }

      const updateQuery = `
        UPDATE users
        SET user_email = ?, first_name = ?, last_name = ?, updated_at = NOW()
        WHERE id_user = ?;
      `;
      const updateParams = [
        userModel.getUserEmail(),
        userModel.getFirstName(),
        userModel.getLastName(),
        idUser,
      ];
      await this.mysqlService.query(updateQuery, updateParams);

      const selectQuery = `
        SELECT id_user, user_email, first_name, last_name, created_at, updated_at, user_active
        FROM users
        WHERE id_user = ?;
      `;
      const updatedResult = await this.mysqlService.query(selectQuery, [
        idUser,
      ]);

      if (updatedResult.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve updated user.',
        });
      }

      const updatedUser = updatedResult[0];
      userModel.setIdUser(updatedUser.id_user);
      userModel.setUserEmail(updatedUser.user_email);
      userModel.setFirstName(updatedUser.first_name);
      userModel.setLastName(updatedUser.last_name);
      const userResponse: UserResponse =
        UserAdapter.fromUserModelToUserResponse(userModel);

      return userResponse;
    } catch (error) {
      throw error;
    }
  }

  async findById(idUser: number): Promise<UserResponse | null> {
    try {
      const query: string = `
        SELECT u.id_user as "idUser", u.user_email as "userEmail", u.user_password as "userPassword",
        u.first_name as "firstName", u.last_name as "lastName", u.user_active as "userActive", u.id_user_type as "idUserType",
        ut.name, ut.description
        FROM users u
        INNER JOIN user_type ut ON ut.id_user_type = u.id_user_type
        WHERE u.id_user = ?
      `;
      const userFound: UserResponseSql[] =
        await this.mysqlService.query<UserResponseSql>(query, [idUser]);

      if (userFound.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `User with ID "${idUser}" not found.`,
        });
      }

      const user = userFound[0];
      return UserAdapter.fromUserModelToUserResponse(
        new UserModel(
          user.idUser,
          user.userEmail,
          user.userPassword,
          user.firstName,
          user.lastName,
          user.userActive,
          new UserTypeModel(user.idUserType, user.name, user.description),
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(userEmail: string): Promise<UserResponse | null> {
    try {
      const query: string = `
        SELECT  u.id_user as "idUser", u.user_email as "userEmail", u.user_password as "userPassword",
        u.first_name as "firstName", u.last_name as "lastName", u.user_active as "userActive", u.id_user_type as "idUserType",
        ut.name, ut.description
        FROM users u
        INNER JOIN user_type ut ON ut.id_user_type = u.id_user_type
        WHERE u.user_email = ?
      `;
      const userFound: UserResponseSql[] =
        await this.mysqlService.query<UserResponseSql>(query, [userEmail]);

      if (userFound.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `User with email "${userEmail}" not found.`,
        });
      }

      const user = userFound[0];
      return UserAdapter.fromUserModelToUserResponse(
        new UserModel(
          user.idUser,
          user.userEmail,
          user.userPassword,
          user.firstName,
          user.lastName,
          user.userActive,
          new UserTypeModel(user.idUserType, user.name, user.description),
        ),
      );
    } catch (error) {
      throw error;
    }
  }

  async delete(idUser: number): Promise<boolean> {
    try {
      const userFound = await this.mysqlService.query(
        'SELECT * FROM users WHERE id_user = ?',
        [idUser],
      );

      if (userFound.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `User with ID "${idUser}" not found.`,
        });
      }

      const query: string = `
        DELETE FROM users
        WHERE id_user = ?;
      `;
      const params = [idUser];
      await this.mysqlService.query(query, params);
      return true;
    } catch (error) {
      throw error;
    }
  }
  async findAll(): Promise<UserResponse[]> {
    try {
      const query: string = `
        select u.id_user as "idUser", u.user_email as "userEmail", u.user_password as "userPassword", 
        u.first_name as "firstName", u.last_name  as "lastName", u.user_active as "userActive", u.id_user_type as "idUserType",
        ut.name, ut.description
        from users u inner join user_type ut on ut.id_user_type = u.id_user_type;
      `;
      const users: UserResponseSql[] =
        await this.mysqlService.query<UserResponseSql>(query);
      if (users.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No users found.',
        });
      }
      return users.map((user) =>
        UserAdapter.fromUserModelToUserResponse(
          new UserModel(
            user.idUser,
            user.userEmail,
            user.userPassword,
            user.firstName,
            user.lastName,
            user.userActive,
            new UserTypeModel(user.idUserType, user.name, user.description),
          ),
        ),
      );
    } catch (error) {
      throw error;
    }
  }
}
