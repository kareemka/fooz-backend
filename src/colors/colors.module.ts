import { Module } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { ColorsResolver } from './colors.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [ColorsService, ColorsResolver],
    exports: [ColorsService],
})
export class ColorsModule { }
