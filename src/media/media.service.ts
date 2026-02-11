import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MediaService {
    private readonly uploadDir = path.join(process.cwd(), 'public', 'uploads');

    constructor() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }

    async getFileUrl(filename: string): Promise<string> {
        const baseUrl = process.env.APP_URL || 'http://localhost:3000';
        return `${baseUrl}/public/uploads/${filename}`;
    }

    async saveFile(file: Express.Multer.File): Promise<string> {
        // This method is kept for backward compatibility if needed, 
        // but the controller now uses diskStorage.
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.glb'];
        const ext = path.extname(file.originalname).toLowerCase();
        const baseName = path.basename(file.originalname, ext);

        if (!allowedExtensions.includes(ext)) {
            throw new BadRequestException(`File type ${ext} is not allowed.`);
        }

        let filename = `${baseName}${ext}`;
        let filePath = path.join(this.uploadDir, filename);
        let counter = 1;

        while (fs.existsSync(filePath)) {
            filename = `${baseName}_${counter}${ext}`;
            filePath = path.join(this.uploadDir, filename);
            counter++;
        }

        await fs.promises.writeFile(filePath, file.buffer);
        return this.getFileUrl(filename);
    }

    async getAllFiles(type?: 'IMAGE' | 'GLB', page: number = 1, limit: number = 20) {
        const allFiles = await fs.promises.readdir(this.uploadDir);
        const baseUrl = process.env.APP_URL || 'http://localhost:3000';

        // Filter by extension first to get correct count
        const filteredFilenames = allFiles.filter(filename => {
            const ext = path.extname(filename).toLowerCase();
            const fileType = ['.glb'].includes(ext) ? 'GLB' : 'IMAGE';
            return !type || fileType === type;
        });

        const total = filteredFilenames.length;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedFilenames = filteredFilenames.reverse().slice(startIndex, endIndex);

        const mediaFiles = await Promise.all(
            paginatedFilenames.map(async (filename) => {
                const filePath = path.join(this.uploadDir, filename);
                const stats = await fs.promises.stat(filePath);
                const ext = path.extname(filename).toLowerCase();
                const fileType = ['.glb'].includes(ext) ? 'GLB' : 'IMAGE';

                return {
                    id: filename,
                    url: `${baseUrl}/public/uploads/${filename}`,
                    name: filename,
                    type: fileType,
                    size: stats.size,
                    createdAt: stats.birthtime.toISOString(),
                };
            })
        );

        return {
            items: mediaFiles,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };
    }

    async deleteFile(id: string) {
        const filePath = path.join(this.uploadDir, id);
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
        }
    }

    async deleteMultipleFiles(ids: string[]) {
        await Promise.all(ids.map(id => this.deleteFile(id)));
    }
}
