import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';

async function processOldImages() {
    const uploadsDir = path.join(__dirname, 'public', 'uploads');
    console.log(`Scanning uploads directory: ${uploadsDir}`);

    if (!fs.existsSync(uploadsDir)) {
        console.error('Uploads directory does not exist.');
        process.exit(1);
    }

    const files = fs.readdirSync(uploadsDir);
    let count = 0;
    let skipped = 0;
    let errors = 0;

    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        
        // Skip non-images and already generated -og files
        if (ext === '.glb' || file.endsWith('-og.jpg')) {
            continue;
        }

        const filePath = path.join(uploadsDir, file);
        const parsedPath = path.parse(file);
        const ogFilename = `${parsedPath.name}-og.jpg`;
        const ogFilePath = path.join(uploadsDir, ogFilename);

        // Skip if -og variant already exists
        if (fs.existsSync(ogFilePath)) {
            skipped++;
            continue;
        }

        try {
            console.log(`Processing: ${file}`);
            await sharp(filePath)
                .resize(1200, 630)
                .jpeg({ quality: 80 })
                .toFile(ogFilePath);
            count++;
        } catch (err: any) {
            console.error(`Error processing ${file}:`, err.message);
            errors++;
        }
    }

    console.log('\n--- Migration Summary ---');
    console.log(`Successfully generated: ${count} images`);
    console.log(`Skipped (already exist): ${skipped} images`);
    console.log(`Errors: ${errors}`);
}

processOldImages();
