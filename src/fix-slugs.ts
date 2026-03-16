import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlug(name: string): string {
    // Keep Arabic letters, English letters, and numbers
    // Arabic range: \u0600-\u06FF
    let slug = name.toLowerCase()
        .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, '') // Remove special characters but keep Arabic
        .trim()
        .replace(/\s+/g, '-')                      // Replace spaces with single dash
        .replace(/-+/g, '-');                     // Collapse multiple dashes

    // If slug is empty (only special chars were provided), use fallback
    if (!slug || slug === '-') {
        slug = 'product';
    }

    // Add a short random suffix for uniqueness
    const suffix = Math.random().toString(36).substring(2, 7);
    return `${slug}-${suffix}`;
}

async function main() {
    console.log('Starting slug migration...');
    
    const products = await prisma.product.findMany({
        where: {
            OR: [
                { slug: { startsWith: '-' } },
                { slug: { contains: '--' } }
            ]
        }
    });

    console.log(`Found ${products.length} products with malformed slugs.`);

    for (const product of products) {
        const newSlug = generateSlug(product.name);
        console.log(`Updating: "${product.slug}" -> "${newSlug}" (Name: ${product.name})`);
        
        await prisma.product.update({
            where: { id: product.id },
            data: { slug: newSlug }
        });
    }

    console.log('Slug migration completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
