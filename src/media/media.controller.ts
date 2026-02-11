import { Controller, Post, Get, Query, UseInterceptors, UploadedFile, BadRequestException, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { MediaService } from './media.service';
import * as path from 'path';
import { DeleteMultipleMediaDto } from './dto/delete-multiple-media.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
    constructor(private readonly mediaService: MediaService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './public/uploads',
            filename: (req, file, cb) => {
                const ext = path.extname(file.originalname).toLowerCase();
                const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '-');
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${baseName}-${uniqueSuffix}${ext}`);
            },
        }),
        limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const url = await this.mediaService.getFileUrl(file.filename);

        return {
            id: path.basename(url),
            url,
            name: file.originalname,
            type: file.mimetype.includes('image') ? 'IMAGE' : 'GLB',
            size: file.size,
            createdAt: new Date().toISOString(),
        };
    }

    @Get()
    async getFiles(
        @Query('type') type?: 'IMAGE' | 'GLB',
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.mediaService.getAllFiles(
            type,
            page ? parseInt(page) : 1,
            limit ? parseInt(limit) : 20
        );
    }

    @Post('delete-multiple')
    async deleteMultiple(@Body() deleteDto: DeleteMultipleMediaDto) {
        await this.mediaService.deleteMultipleFiles(deleteDto.ids);
        return { success: true };
    }

    @Delete(':id')
    async deleteFile(@Param('id') id: string) {
        await this.mediaService.deleteFile(id);
        return { success: true };
    }
}
