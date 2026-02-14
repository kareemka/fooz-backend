import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MediaType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MediaService {
    private readonly uploadDir = path.join(process.cwd(), 'public', 'uploads');

    constructor(private readonly prisma: PrismaService) {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    async saveFile(file: Express.Multer.File): Promise<any> {
        // This is now just a helper that ensures DB record is created
        // The disk storage is handled by Multer in the controller
        const ext = path.extname(file.originalname).toLowerCase();
        const type = ext === '.glb' ? MediaType.GLB : MediaType.IMAGE;
        const url = await this.getFileUrl(file.filename);

        return this.prisma.media.create({
            data: {
                name: file.originalname,
                path: file.filename,
                url,
                type,
                size: file.size,
            },
        });
    }

    // Explicitly named for clarity
    async createRecord(file: { originalname: string, filename: string, size: number }): Promise<any> {
        const ext = path.extname(file.originalname).toLowerCase();
        const type = ext === '.glb' ? (MediaType.GLB as any) : (MediaType.IMAGE as any);
        const url = await this.getFileUrl(file.filename);

        return this.prisma.media.create({
            data: {
                name: file.originalname,
                path: file.filename,
                url,
                type,
                size: file.size,
            },
        });
    }

    async getFileUrl(filename: string): Promise<string> {
        const baseUrl = process.env.APP_URL || 'http://localhost:3000';
        return `${baseUrl}/public/uploads/${filename}`;
    }

    async getAllFiles(type?: any, page: number = 1, limit: number = 20) {
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            this.prisma.media.findMany({
                where: type ? { type } : {},
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.media.count({
                where: type ? { type } : {},
            }),
        ]);

        return {
            items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };
    }

    async deleteFile(id: string) {
        const media = await this.prisma.media.findUnique({
            where: { id }
        }) || await this.prisma.media.findFirst({
            where: { path: id }
        });

        if (media) {
            const filePath = path.join(this.uploadDir, media.path);
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
            }
            await this.prisma.media.delete({
                where: { id: media.id }
            });
        }
    }

    async deleteMultipleFiles(ids: string[]) {
        await Promise.all(ids.map(id => this.deleteFile(id)));
    }
}
