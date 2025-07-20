import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { environments } from './settings/environments/environments';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RpcCustomExceptionFilterMicoserviceSecurity } from './shared/errors/exception/GlobalExceptionHandler';

async function bootstrap() {
  const logger: Logger = new Logger('Main');
  /*
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(morgan('dev'));
  const config = new DocumentBuilder()
    .setTitle('Products Microservice API')
    .setBasePath('api')
    .setDescription('API - Clean Architecture with NestJS & TypeScript')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    customSiteTitle: 'API Documentation',
    customCssUrl:
      'https://mariosalazar-styles-swagger-ui.vercel.app/css/swagger-ui.css',
  });
  //await app.listen(4002);
  logger.log(`🚀🎉 This API is running on: http://127.0.0.1:${4002}`);
  */
  const microservices =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [`${environments.kafkaBroker}`],
          clientId: environments.authenticationKafkaClientId,
        },
        consumer: {
          groupId: environments.authenticationKafkaGroupId,
          allowAutoTopicCreation: true,
        },
      },
    });
  microservices.useGlobalFilters(
    new RpcCustomExceptionFilterMicoserviceSecurity(),
  );
  await microservices.listen();
  logger.log(`🚀🎉 The Authentication microservice is listening to KAFKA...✅`);
}
bootstrap();
