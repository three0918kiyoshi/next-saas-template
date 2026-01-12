import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const users = [
        { email: "demo@example.com", name: "Demo User" },
        { email: "admin@example.com", name: "Admin User" },
    ];

    for (const user of users) {
        await prisma.user.upsert({
            where: { email: user.email },
            update: {},
            create: user,
        });
    }
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });