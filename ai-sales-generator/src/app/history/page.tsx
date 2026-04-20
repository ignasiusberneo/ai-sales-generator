import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import HistoryClient from "@/components/HistoryClient";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const pages = await prisma.salesPage.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const serialized = pages.map((p) => ({
    id: p.id,
    productName: p.productName,
    targetAudience: p.targetAudience,
    price: p.price,
    createdAt: p.createdAt.toISOString(),
  }));

  return <HistoryClient pages={serialized} />;
}