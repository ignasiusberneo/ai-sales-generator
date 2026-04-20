import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import SalesPagePreview from "@/components/SalesPagePreview";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const { id } = await params;

  const page = await prisma.salesPage.findUnique({
    where: { id },
  });

  if (!page || page.userId !== session.user.id) notFound();

  const content = JSON.parse(page.generatedContent);
  const exportUrl = "/api/export/" + page.id;

  return (
    <div>
      <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <a href="/history" className="text-slate-400 hover:text-white text-sm">
            Back to My Pages
          </a>
          <span className="text-slate-600">|</span>
          <span className="text-sm font-medium">{page.productName}</span>
        </div>
        <div className="flex items-center gap-3">
          <a href={exportUrl} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition">
            Export HTML
          </a>
        </div>
      </div>
      <SalesPagePreview content={content} productName={page.productName} />
    </div>
  );
}