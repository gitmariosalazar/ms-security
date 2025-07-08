import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InterfaceUserTypeRepository } from 'src/modules/user-type/domain/contracts/user-type.repository.interface';
import { UserTypeResponse } from 'src/modules/user-type/domain/schemas/dto/response/user-type.response';
import { UserTypeModel } from 'src/modules/user-type/domain/schemas/model/user-type.model';
import { statusCode } from 'src/settings/environments/status-code';
import { DatabaseServiceMySQL } from 'src/shared/connections/database/mysql/mysql.service';

@Injectable()
export class UserTypeMySQLImplementation
  implements InterfaceUserTypeRepository
{
  constructor(private readonly mysqlService: DatabaseServiceMySQL) {}

  async create(userTypeModel: UserTypeModel): Promise<UserTypeResponse | null> {
    try {
      const userTypeFound = await this.mysqlService.query(
        'SELECT * FROM user_type WHERE name = ?',
        [userTypeModel.getName()],
      );
      if (userTypeFound.length > 0) {
        throw new RpcException({
          statusCode: statusCode.CONFLICT,
          message: `User type with name "${userTypeModel.getName()}" already exists.`,
        });
      }

      const query: string = `
        INSERT INTO user_type (name, description, updated_at)
        VALUES (?, ?, NOW())
        RETURNING id_user_type, name, description, created_at, updated_at;
      `;
      const params = [userTypeModel.getName(), userTypeModel.getDescription()];
      const result = await this.mysqlService.query(query, params);
      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.INTERNAL_SERVER_ERROR,
          message: 'Failed to create user type.',
        });
      }
      const userType = result[0];
      return {
        idUserType: userType.id_user_type,
        name: userType.name,
        description: userType.description,
        createdAt: userType.created_at,
        updatedAt: userType.updated_at,
      };
    } catch (error) {
      throw error;
    }
  }

  async update(
    idUserType: number,
    userTypeModel: UserTypeModel,
  ): Promise<UserTypeResponse | null> {
    try {
      const userTypeFound = await this.mysqlService.query(
        'SELECT * FROM user_type WHERE id_user_type = ?',
        [idUserType],
      );
      if (userTypeFound.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `User type with ID "${idUserType}" not found.`,
        });
      }
      const query: string = `
        UPDATE user_type
        SET name = ?, description = ?
        WHERE id_user_type = ?,
        updated_at = NOW()
        RETURNING id_user_type, name, description, created_at, updated_at;
      `;
      const params = [
        userTypeModel.getName(),
        userTypeModel.getDescription(),
        idUserType,
      ];
      const result = await this.mysqlService.query(query, params);
      if (result.length === 0) {
        return null;
      }
      const userType = result[0];
      return {
        idUserType: userType.id_user_type,
        name: userType.name,
        description: userType.description,
        createdAt: userType.created_at,
        updatedAt: userType.updated_at,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(idUserType: number): Promise<boolean> {
    try {
      const userTypeFound = await this.mysqlService.query(
        'SELECT * FROM user_type WHERE id_user_type = ?',
        [idUserType],
      );
      if (userTypeFound.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `User type with ID "${idUserType}" not found.`,
        });
      }
      const query: string = `
        DELETE FROM user_type
        WHERE id_user_type = ?;
      `;
      const params = [idUserType];
      await this.mysqlService.query(query, params);
      return true;
    } catch (error) {
      throw error;
    }
  }

  async findById(idUserType: number): Promise<UserTypeResponse | null> {
    try {
      const userTypeFound = await this.mysqlService.query(
        'SELECT * FROM user_type WHERE id_user_type = ?',
        [Number(idUserType)],
      );
      if (userTypeFound.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `User type with ID "${idUserType}" not found.`,
        });
      }
      const userType = userTypeFound[0];
      return {
        idUserType: userType.id_user_type,
        name: userType.name,
        description: userType.description,
        createdAt: userType.created_at,
        updatedAt: userType.updated_at,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<UserTypeResponse[]> {
    try {
      const query: string = `
        SELECT id_user_type, name, description, created_at, updated_at
        FROM user_type;
      `;
      const result = await this.mysqlService.query(query);
      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: 'No user types found.',
        });
      }
      return result.map((userType: any) => ({
        idUserType: userType.id_user_type,
        name: userType.name,
        description: userType.description,
        createdAt: userType.created_at,
        updatedAt: userType.updated_at,
      }));
    } catch (error) {
      throw error;
    }
  }

  async findByName(name: string): Promise<UserTypeResponse | null> {
    try {
      const query: string = `
        SELECT id_user_type, name, description, created_at, updated_at
        FROM user_type
        WHERE name = ?;
      `;
      const result = await this.mysqlService.query(query, [name]);
      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `User type with name "${name}" not found.`,
        });
      }
      const userType = result[0];
      return {
        idUserType: userType.id_user_type,
        name: userType.name,
        description: userType.description,
        createdAt: userType.created_at,
        updatedAt: userType.updated_at,
      };
    } catch (error) {
      throw error;
    }
  }

  async findLikeName(name: string): Promise<UserTypeResponse[]> {
    try {
      const query: string = `
        SELECT id_user_type, name, description, created_at, updated_at
        FROM user_type
        WHERE name LIKE ?;
      `;
      const result = await this.mysqlService.query(query, [`%${name}%`]);
      if (result.length === 0) {
        throw new RpcException({
          statusCode: statusCode.NOT_FOUND,
          message: `No user types found matching name "${name}".`,
        });
      }
      return result.map((userType: any) => ({
        idUserType: userType.id_user_type,
        name: userType.name,
        description: userType.description,
        createdAt: userType.created_at,
        updatedAt: userType.updated_at,
      }));
    } catch (error) {
      throw error;
    }
  }
}
