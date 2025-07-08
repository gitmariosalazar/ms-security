import 'dotenv/config';
import * as joi from 'joi';

interface EnvironmentsVariables {
  PORT: number;
  DATABASE_PROVIDER: string;
  DATABASE_PORT: number;
  DATABASE_USERNAME: string;
  DATABASE_NAME: string;
  DATABASE_PASSWORD: string;
  DATABASE_HOSTNAME: string;
  MONGODB_URI: string;
  DATABASE_URL: string;
  SECRET_KEY: string;
  SALT_ROUNDS: number;
  KAFKA_BROKER: string;
  AUTHENTICATION_KAFKA_CLIENT_ID: string;
  AUTHENTICATION_KAFKA_GROUP_ID: string;
  AUTHENTICATION_KAFKA_CLIENT: string;
}

const environmentsSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_PROVIDER: joi.string(),
    DATABASE_PORT: joi.string(),
    DATABASE_USERNAME: joi.string(),
    DATABASE_NAME: joi.string(),
    DATABASE_PASSWORD: joi.string(),
    DATABASE_HOSTNAME: joi.string(),
    MONGODB_URI: joi.string(),
    DATABASE_URL: joi.string(),
    SECRET_KEY: joi.string(),
    SALT_ROUNDS: joi.number(),
    KAFKA_BROKER: joi.string().required(),
    AUTHENTICATION_KAFKA_CLIENT_ID: joi.string().required(),
    AUTHENTICATION_KAFKA_GROUP_ID: joi.string().required(),
    AUTHENTICATION_KAFKA_CLIENT: joi.string().required(),
  })
  .unknown(true);

const { error, value } = environmentsSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const environmentsVariables: EnvironmentsVariables = value;
export const environments = {
  serverPort: environmentsVariables.PORT,
  databasePort: environmentsVariables.DATABASE_PORT,
  databaseProvider: environmentsVariables.DATABASE_PROVIDER,
  databaseUsername: environmentsVariables.DATABASE_USERNAME,
  databaseName: environmentsVariables.DATABASE_NAME,
  databaseHostname: environmentsVariables.DATABASE_HOSTNAME,
  databasePassword: environmentsVariables.DATABASE_PASSWORD,
  mongodbURI: environmentsVariables.MONGODB_URI,
  databaseURL: environmentsVariables.DATABASE_URL,
  secretKey: environmentsVariables.SECRET_KEY,
  saltRound: environmentsVariables.SALT_ROUNDS,
  kafkaBroker: environmentsVariables.KAFKA_BROKER,
  authenticationKafkaClientId:
    environmentsVariables.AUTHENTICATION_KAFKA_CLIENT_ID,
  authenticationKafkaGroupId:
    environmentsVariables.AUTHENTICATION_KAFKA_GROUP_ID,
  authenticationKafkaClient: environmentsVariables.AUTHENTICATION_KAFKA_CLIENT,
};
