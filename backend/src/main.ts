import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe -
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );

  // 
  app.enableCors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"]
  });


  // Example: /users --. api/users
  app.setGlobalPrefix("api/v1")

  const port = process.env.PORT ?? 3001;

  await app.listen(port);
  console.log("Server listening on http://localhost:", `${port}/api/v1`);
}
bootstrap().catch((error) => {
  Logger.error("Error starting sever", error);
  process.exit(1)
});
