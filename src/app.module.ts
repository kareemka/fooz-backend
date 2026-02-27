import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { MediaModule } from './media/media.module';
import { AccessoriesModule } from './accessories/accessories.module';
import { ColorsModule } from './colors/colors.module';
import { FaqModule } from './faq/faq.module';
import { OrderModule } from './order/order.module';
import { AuthModule } from './auth/auth.module';
import { BannersModule } from './banners/banners.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CouponsModule } from './coupons/coupons.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
      introspection: process.env.NODE_ENV !== 'production',
      context: ({ req, res }: { req: any; res: any }) => ({ req, res }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/public',
    }),
    ThrottlerModule.forRoot([{
      ttl: 60, // 1 minute
      limit: 100,
    }]),
    ProductsModule,
    CategoriesModule,
    MediaModule,
    AccessoriesModule,
    ColorsModule,
    FaqModule,
    OrderModule,
    AuthModule,
    BannersModule,
    CouponsModule,
    NotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
