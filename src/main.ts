import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   //configuration
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT') || 7000;
  app.setGlobalPrefix('api');

  //swagger configuration

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('NestJS API')
      .setDescription('This is a nestjs starter api')
      .addBearerAuth()
      .build(),
  );
  SwaggerModule.setup('docs', app, document);


  //root routes path

  await app.listen(port, () => {
    console.log('URL = http://'+config.get<string>('BASE_URL')+":"+port+'/api');

    console.log("Swagger = http://"+config.get<string>('BASE_URL')+":"+port+'/docs');
  });
}
bootstrap();
