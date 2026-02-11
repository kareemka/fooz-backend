import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security: Helmet headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        // connectSrc: ["'self'", "https:", "http:"],
        connectSrc: ["'self'", "https://api.fooz-gaming.com"]
      },
    },
  }));

  // Security: CORS
  app.enableCors({
    origin: [
      'https://admin.fooz-gaming.com',
      'https://fooz-gaming.com',
      // 'http://localhost:3000',
      // 'http://localhost:3001',
      // 'http://localhost:3002',
    ],
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false, // مهم للـ OPTIONS
    optionsSuccessStatus: 204,
  });


  // Security: Global Body Limits
  const { json, urlencoded } = require('body-parser');
  app.use(json({ limit: '200mb' }));
  app.use(urlencoded({ limit: '200mb', extended: true }));

  // Security: Global Validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
