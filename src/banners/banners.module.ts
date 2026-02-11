import { Module } from '@nestjs/common';
import { BannerResolver } from './banners.resolver';
import { BannersService } from './banners.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    providers: [BannerResolver, BannersService, PrismaService],
    exports: [BannersService],
})
export class BannersModule { }
