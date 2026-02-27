import { PrismaClient, MediaType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), 'public', 'uploads');

async function syncMedia() {
    console.log('Starting media sync...');

    if (!fs.existsSync(uploadDir)) {
        console.log('Upload directory does not exist.');
        return;
    }

    const files = fs.readdirSync(uploadDir);
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';

    for (const file of files) {
        const filePath = path.join(uploadDir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) continue;

        const ext = path.extname(file).toLowerCase();
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.glb'];

        if (!allowedExtensions.includes(ext)) continue;

        const type = ext === '.glb' ? MediaType.GLB : MediaType.IMAGE;
        const url = `${baseUrl}/public/uploads/${file}`;

        // Check if already exists in DB
        const existing = await prisma.media.findFirst({
            where: { path: file }
        });

        if (!existing) {
            console.log(`Syncing: ${file}`);
            await prisma.media.create({
                data: {
                    name: file,
                    path: file,
                    url,
                    type,
                    size: stats.size,
                    createdAt: stats.birthtime
                }
            });
        } else {
            console.log(`Skipping (already in DB): ${file}`);
        }
    }

    console.log('Media sync completed.');
}

syncMedia()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
