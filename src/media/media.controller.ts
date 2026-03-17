import { Controller, Post, Get, Query, UseInterceptors, UploadedFile, BadRequestException, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
// type definitions for uuid are provided by @types/uuid (already installed)
import { MediaService } from './media.service';
import * as path from 'path';
import { DeleteMultipleMediaDto } from './dto/delete-multiple-media.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import sharp from 'sharp';

@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) { }

    @Post('upload')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './public/uploads',
            filename: (_req, file, cb) => {
                const ext = path.extname(file.originalname).toLowerCase();
                const baseName = uuidv4(); // Use UUID for filename to prevent original filename based attacks
                // const uploadDir = path.join(process.cwd(), 'public', 'uploads');

                let filename = `${baseName}${ext}`;
                cb(null, filename);
            },
        }),
        fileFilter: (_req, file, cb) => {
            const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.glb'];
            // tighter MIME types: do not allow generic application/octet-stream
            const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'model/gltf-binary', 'application/octet-stream'];
            const ext = path.extname(file.originalname).toLowerCase();

            if (allowedExtensions.includes(ext) && allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new BadRequestException(`نوع الملف ${ext} أو نوع MIME ${file.mimetype} غير مدعوم.`), false);
            }
        },
        limits: { fileSize: 50 * 1024 * 1024 }, // Reduced from 200MB to 50MB (matching global limit)
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        // Generate optimized OG Image for SEO if it's an image (not GLB)
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.glb') {
            try {
                // Get the base filename without extension
                const parsedPath = path.parse(file.filename);
                // Create the new -og.jpg filename matching user request
                const ogFilename = `${parsedPath.name}-og.jpg`;
                const ogFilePath = path.join('./public/uploads', ogFilename);

                // Use sharp to create a 1200x630 SEO-friendly image as requested by user
                await sharp(file.path)
                  .resize(1200, 630)
                  .jpeg({ quality: 80 })
                  .toFile(ogFilePath);
            } catch (err) {
                console.error('Error generating OG image:', err);
            }
        }

        // Now save the record in database
        return this.mediaService.createRecord(file);
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
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async deleteMultiple(@Body() deleteDto: DeleteMultipleMediaDto) {
        await this.mediaService.deleteMultipleFiles(deleteDto.ids);
        return { success: true };
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    async deleteFile(@Param('id') id: string) {
        await this.mediaService.deleteFile(id);
        return { success: true };
    }
}
