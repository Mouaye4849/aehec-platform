import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    const deleted = await prisma.result.deleteMany();

    console.log(`Deleted ${deleted.count} results`);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });