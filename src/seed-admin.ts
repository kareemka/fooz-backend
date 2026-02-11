import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@fooz.com';
    const existingUser = await prisma.user.findUnique({
        where: { email: adminEmail },
    });

    if (!existingUser) {
        const hashedPassword = await bcrypt.hash('admin123456', 10);
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
