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
    origin: process.env.FRONTEND_URL?.split(",") ?? "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST,", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"]
  });

  // Enable  Swagger docs
  // const config = new DocumentBuilder();
  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup("api/docs", app, document, {
  //   swaggerOptions: {
  //     persistAuthorization: true, tagsSorter: "alpha",
  //     operationSorter:"alpha"
  //   },
  //   customSiteTitle:"API Documentation",
  //   customfavicon: "https://nestjs.com/img/logo-small.svg",
  //   customCss: "
  //   .swagger-ui, topbar{display: none}"
  //   "swagger-ui, info{margin: 50px 0}",
  //   "swagger-ui, info.title{font-size: 2.5em, color:}",
    
    

  // });


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
