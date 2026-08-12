import { prisma } from "@/lib/prisma";
import { CommitteeList } from "@/app/comite/CommitteeList";

export default async function CommitteePage() {
    const members = await prisma.executiveMember.findMany({
        orderBy: { ordre: "asc" },
    });

    return <CommitteeList members={members} />;
}
