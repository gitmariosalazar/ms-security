// src/shared/database/database.service.mysql.ts
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as mysql from 'mysql2';
import { environments } from 'src/settings/environments/environments';

@Injectable()
export class DatabaseServiceMySQL implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger = new Logger(DatabaseServiceMySQL.name);
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysql.createConnection({
      host: environments.databaseHostname,
      user: environments.databaseUsername,
      database: environments.databaseName,
      password: environments.databasePassword,
      port: environments.databasePort,
    });
  }

  async onModuleInit() {
    await this.connectToMySQL();
  }

  async onModuleDestroy() {
    await this.close();
  }

  private async connectToMySQL(): Promise<void> {
    try {
      await new Promise((resolve, reject) => {
        this.connection.connect((err) => {
          if (err) {
            reject(err);
          } else {
            this.logger.log(`🛢️ Connected to MySQL successfully 🎉!`);
            resolve(true);
          }
        });
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to connect to MySQL: ${message}`);
      throw new RpcException({
        statusCode: 500,
        message: `Failed to connect to MySQL: ${message}`,
      });
    }
  }

  async query<T>(sql: string, params: any[] = []): Promise<any> {
    try {
      return await new Promise((resolve, reject) => {
        this.connection.query(sql, params, (error, results) => {
          if (error) {
            const message =
              error instanceof Error ? error.message : 'Error desconocido';
            this.logger.error(`MySQL query error: ${message}`);
            reject(
              new RpcException({
                statusCode: 500,
                message: `Database query failed: ${message}`,
              }),
            );
          } else {
            resolve(results);
          }
        });
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to execute query: ${message}`);
      throw new RpcException({
        statusCode: 500,
        message: `Failed to execute query: ${message}`,
      });
    }
  }

  async close(): Promise<void> {
    try {
      await new Promise((resolve, reject) => {
        this.connection.end((err) => {
          if (err) {
            reject(err);
          } else {
            this.logger.log('MySQL connection closed successfully');
            resolve(true);
          }
        });
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Error desconocido';
      this.logger.error(`Failed to close MySQL connection: ${message}`);
      throw new RpcException({
        statusCode: 500,
        message: `Failed to close MySQL connection: ${message}`,
      });
    }
  }
}
