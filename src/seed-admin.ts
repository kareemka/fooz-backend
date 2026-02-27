import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@fooz.com';
    const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD;

    if (!adminPassword) {
        throw new Error(
            'ADMIN_DEFAULT_PASSWORD environment variable is required. ' +
            'Set it in your .env file before running this seed script.'
        );
    }

    const existingUser = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existingUser) {
        // bcrypt cost 12 — stronger than 10, still fast enough for a one-time seed
        const hashedPassword = await bcrypt.hash(adminPassword, 12);
        await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                name: 'Admin',
                role: 'admin',
            },
        });
        console.log('Admin user created: ' + adminEmail);
    } else {
        console.log('Admin user already exists');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
