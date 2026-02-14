import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MediaResolver } from './media.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [
        PrismaModule,
        MulterModule.register({
            limits: {
                fileSize: 50 * 1024 * 1024, // 50MB
            },
        }),
    ],
    controllers: [MediaController],
    providers: [MediaService, MediaResolver],
    exports: [MediaService],
})
export class MediaModule { }
