import { prisma } from "@/lib/prisma";
import { ResourcesList } from "@/app/ressources/ResourcesList";

export default async function ResourcesPage() {
    const resources = await prisma.resource.findMany({
        orderBy: { createdAt: "desc" },
    });

    return <ResourcesList resources={resources} />;
}
