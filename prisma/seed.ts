import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Start seeding ...');

    // 1️⃣ Clean database (order مهم بسبب العلاقات)
    await prisma.accessory.deleteMany();
    await prisma.productSize.deleteMany();
    await prisma.product.deleteMany(); // Delete products first because of the many-to-many link to Colors
    await prisma.color.deleteMany();
    await prisma.category.deleteMany();

    console.log('🧹 Database cleared');

    // 2️⃣ Categories
    const chairsCat = await prisma.category.create({
        data: {
            slug: 'chairs',
            name: 'كراسي قيمنق',
            image:
                'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=800',
        },
    });

    const desksCat = await prisma.category.create({
        data: {
            slug: 'desks',
            name: 'طاولات قيمنق',
            image:
                'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=800',
        },
    });

    const keyboardsCat = await prisma.category.create({
        data: {
            slug: 'keyboards',
            name: 'كيبوردات',
            image:
                'https://images.unsplash.com/photo-1587829741301-3231756c5139?auto=format&fit=crop&q=80&w=800',
        },
    });

    const accessoriesCat = await prisma.category.create({
        data: {
            slug: 'accessories',
            name: 'اكسسوارات',
            image:
                'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=800',
        },
    });

    // 3️⃣ Product: Cyber Throne (Chair) + Accessories
    await prisma.product.create({
        data: {
            slug: 'cyber-throne',
            name: 'العرش السيبراني',
            description:
                'كرسي ألعاب متطور بتصميم مريح وإضاءة RGB مدمجة، مصمم لساعات طويلة من اللعب.',
            mainImage:
                'https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=800',
            galleryImages: [
                'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&q=80&w=800',
            ],
            glbFileUrl: 'http://localhost:3000/models/chair.glb',
            categoryId: chairsCat.id,
            price: 350000,
            discountPercentage: 15,
            stock: 15,

            surfaceColors: {
                create: [
                    {
                        name: 'نيون أرجواني',
                        image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200',
                    },
                    {
                        name: 'سايبر أزرق',
                        image: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=200',
                    },
                ],
            },
            edgeColors: {
                create: [
                    {
                        name: 'أسود مطفي',
                        image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200',
                    }
                ]
            },


            sizes: {
                create: [
                    { name: 'Standard', price: 350000, dimensions: 'M' },
                    { name: 'XL', price: 425000, dimensions: 'XL' },
                ],
            },

            accessories: {
                create: [
                    {
                        name: 'وسادة رقبة',
                        price: 25000,
                        image:
                            'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=200',
                    },
                    {
                        name: 'عجلات صامتة',
                        price: 35000,
                        image:
                            'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=200',
                    },
                ],
            },
        },
    });

    // 4️⃣ Product: Stealth Desk
    await prisma.product.create({
        data: {
            slug: 'stealth-desk',
            name: 'مكتب الشبح',
            description: 'مكتب ألعاب أسود كامل مع سطح من ألياف الكربون وتصميم عصري.',
            mainImage:
                'https://images.unsplash.com/photo-1618506469999-a0a48544865b?auto=format&fit=crop&q=80&w=800',
            galleryImages: [
                'https://images.unsplash.com/photo-1615663245857-acda5b24706e?auto=format&fit=crop&q=80&w=800',
            ],
            categoryId: desksCat.id,
            price: 275000,
            stock: 8,

            surfaceColors: {
                create: [
                    { name: 'أسود', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200' }
                ]
            },
            edgeColors: {
                create: [
                    { name: 'كربون', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200' }
                ]
            },

            sizes: {
                create: [
                    { name: '120cm', price: 275000, dimensions: '120x60cm' },
                    { name: '160cm', price: 350000, dimensions: '160x80cm' },
                ],
            },
        },
    });

    // 5️⃣ Product: Ergo Mesh Chair
    await prisma.product.create({
        data: {
            slug: 'ergo-mesh',
            name: 'أيرغو ميش',
            description: 'كرسي مريح بظهر شبكي للتهوية الممتازة، مثالي للعمل والدراسة المستمرة.',
            mainImage:
                'https://images.unsplash.com/photo-1682339506692-a9b34379dc04?auto=format&fit=crop&q=80&w=800',
            galleryImages: [
                'https://images.unsplash.com/photo-1682339506840-7e61b1816f19?auto=format&fit=crop&q=80&w=800',
            ],
            categoryId: chairsCat.id,
            price: 185000,
            discountPercentage: 10,
            stock: 20,

            surfaceColors: {
                create: [
                    { name: 'رمادي', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200' },
                    { name: 'أسود', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200' },
                ],
            },
            edgeColors: {
                create: [
                    { name: 'أسود', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200' }
                ]
            },

            sizes: {
                create: [{ name: 'Standard', price: 185000, dimensions: 'Standard' }],
            },
        },
    });

    // 6️⃣ Product: RGB Mechanical Keyboard
    await prisma.product.create({
        data: {
            slug: 'rgb-mech-kb',
            name: 'لوحة مفاتيح ميكانيكية RGB',
            description:
                'لوحة مفاتيح ميكانيكية احترافية مع مفاتيح سريعة الاستجابة وإضاءة RGB خلابة.',
            mainImage:
                'https://images.unsplash.com/photo-1618384800394-2456b59ebf6b?auto=format&fit=crop&q=80&w=800',
            galleryImages: [
                'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=800',
            ],
            categoryId: keyboardsCat.id,
            price: 120000,
            discountPercentage: 20,
            stock: 30,

            surfaceColors: {
                create: [
                    { name: 'أبيض', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200' },
                    { name: 'أسود', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200' },
                ],
            },
            edgeColors: {
                create: [
                    { name: 'أسود', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200' }
                ]
            },

            sizes: {
                create: [{ name: 'Full Size', price: 120000 }],
            },

            accessories: {
                create: [
                    {
                        name: 'مسند معصم جلدي',
                        price: 15000,
                        image:
                            'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=200',
                    },
                    {
                        name: 'كيبل USB مضفر',
                        price: 10000,
                        image:
                            'https://images.unsplash.com/photo-1615751072497-5f5169febe17?auto=format&fit=crop&q=80&w=200',
                    },
                ],
            },
        },
    });

    // 7️⃣ Product: Streamer Desk
    await prisma.product.create({
        data: {
            slug: 'streamer-desk',
            name: 'مكتب الستريمر الاحترافي',
            description:
                'مكتب واسع مصمم خصيصاً لصناع المحتوى مع حوامل مدمجة للكاميرا والمايك وإدارة كيبلات متطورة.',
            mainImage:
                'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?auto=format&fit=crop&q=80&w=800',
            galleryImages: [
                'https://images.unsplash.com/photo-1507908708918-778587c9e563?auto=format&fit=crop&q=80&w=800',
            ],
            categoryId: desksCat.id,
            price: 550000,
            stock: 5,

            surfaceColors: {
                create: [
                    { name: 'خشبي داكن', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200' }
                ]
            },
            edgeColors: {
                create: [
                    { name: 'أسود مطفي', image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=200' }
                ]
            },

            sizes: {
                create: [
                    { name: 'Large', price: 550000, dimensions: '180cm' },
                    { name: 'Extra Large', price: 650000, dimensions: '200cm' }
                ],
            },

            accessories: {
                create: [
                    {
                        name: 'حامل شاشة ثلاثي',
                        price: 85000,
                        image:
                            'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=200',
                    },
                    {
                        name: 'حامل مايك احترافي',
                        price: 45000,
                        image:
                            'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=200',
                    },
                ],
            },
        },
    });

    console.log('✅ Seeding finished successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
