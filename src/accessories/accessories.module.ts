import { Module } from '@nestjs/common';
import { AccessoriesService } from './accessories.service';
import { AccessoriesResolver } from './accessories.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    providers: [AccessoriesResolver, AccessoriesService],
    exports: [AccessoriesService],
})
export class AccessoriesModule { }
