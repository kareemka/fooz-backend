import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Environment
  const nodeEnv = process.env.NODE_ENV || 'development';
  const port = parseInt(process.env.PORT || '3000', 10);
  const apiUrl = process.env.APP_URL || `http://localhost:${port}`;

  if (nodeEnv === 'production' && typeof (app as any).enable === 'function') {
    (app as any).enable('trust proxy');
  }

  // Security: Helmet headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        connectSrc: ["'self'", 'https:'],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  }));

  // Security: CORS
  const allowedOrigins =
    nodeEnv === 'production'
      ? [
          'https://admin.fooz-gaming.com',
          'https://fooz-gaming.com',
          'https://www.fooz-gaming.com',
        ]
      : [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:3002',
          'http://localhost:3003',
        ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400,
  });

  // Security: Global Body Limits
  const { json, urlencoded } = require('body-parser');
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ limit: '1mb', extended: true }));

  // Security: Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      skipMissingProperties: false,
      stopAtFirstError: true,
      forbidUnknownValues: true,
    }),
  );

  // Disable x-powered-by (if method exists)
  if (typeof (app as any).disable === 'function') {
    (app as any).disable('x-powered-by');
  }

  const finalPort = nodeEnv === 'production' ? port : port;
  const host = nodeEnv === 'production' ? '0.0.0.0' : '127.0.0.1';

  await app.listen(finalPort, host);

  logger.log(`Application running on: ${apiUrl}`);
  logger.log(`Environment: ${nodeEnv}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});

