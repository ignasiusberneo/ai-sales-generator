import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const page = await prisma.salesPage.findUnique({ where: { id } });

  if (!page || page.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const content = JSON.parse(page.generatedContent);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${page.productName} - Sales Page</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="font-sans">

  <!-- Hero -->
  <section class="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white py-24 px-6 text-center">
    <div class="max-w-4xl mx-auto">
      <div class="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
        Introducing ${page.productName}
      </div>
      <h1 class="text-4xl md:text-6xl font-extrabold leading-tight mb-6">${content.headline}</h1>
      <p class="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">${content.subheadline}</p>
      <button class="bg-white text-blue-700 font-bold text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transition">
        ${content.cta.primary}
      </button>
      <p class="text-blue-200 text-sm mt-4">${content.cta.secondary}</p>
    </div>
  </section>

  <!-- Description -->
  <section class="bg-white py-20 px-6">
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-3xl font-bold text-slate-800 mb-6">What is ${page.productName}?</h2>
      <p class="text-slate-600 text-lg leading-relaxed">${content.productDescription}</p>
    </div>
  </section>

  <!-- Benefits -->
  <section class="bg-slate-50 py-20 px-6">
    <div class="max-w-5xl mx-auto">
      <h2 class="text-3xl font-bold text-slate-800 text-center mb-12">Why Choose ${page.productName}?</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${content.benefits
          .map(
            (b: { title: string; description: string }, i: number) => `
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <span class="text-blue-600 font-bold">${i + 1}</span>
          </div>
          <h3 class="font-bold text-slate-800 text-lg mb-2">${b.title}</h3>
          <p class="text-slate-500">${b.description}</p>
        </div>`,
          )
          .join("")}
      </div>
    </div>
  </section>

  <!-- Features -->
  <section class="bg-white py-20 px-6">
    <div class="max-w-5xl mx-auto">
      <h2 class="text-3xl font-bold text-slate-800 text-center mb-12">Everything You Need</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${content.features
          .map(
            (f: { name: string; detail: string }) => `
        <div class="text-center p-6 rounded-2xl border border-slate-100">
          <h3 class="font-bold text-slate-800 mb-2">${f.name}</h3>
          <p class="text-slate-500 text-sm">${f.detail}</p>
        </div>`,
          )
          .join("")}
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="bg-slate-50 py-20 px-6">
    <div class="max-w-5xl mx-auto">
      <h2 class="text-3xl font-bold text-slate-800 text-center mb-12">What Our Customers Say</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        ${[
          content.socialProof.testimonial1,
          content.socialProof.testimonial2,
          content.socialProof.testimonial3,
        ]
          .map(
            (t: { name: string; role: string; quote: string }) => `
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div class="flex mb-4">
            <span class="text-yellow-400 text-lg">★★★★★</span>
          </div>
          <p class="text-slate-600 italic mb-6">"${t.quote}"</p>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              ${t.name.charAt(0)}
            </div>
            <div>
              <p class="font-semibold text-slate-800 text-sm">${t.name}</p>
              <p class="text-slate-400 text-xs">${t.role}</p>
            </div>
          </div>
        </div>`,
          )
          .join("")}
      </div>
    </div>
  </section>

  <!-- Pricing -->
  <section class="bg-white py-20 px-6">
    <div class="max-w-lg mx-auto text-center">
      <h2 class="text-3xl font-bold text-slate-800 mb-4">Simple, Transparent Pricing</h2>
      <div class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white shadow-2xl">
        <div class="text-5xl font-extrabold mb-4">${content.pricing.price}</div>
        <p class="text-blue-100 mb-8">${content.pricing.description}</p>
        <button class="w-full bg-white text-blue-700 font-bold py-4 rounded-2xl text-lg">
          ${content.cta.primary}
        </button>
        <p class="text-blue-200 text-sm mt-4">${content.pricing.guarantee}</p>
      </div>
    </div>
  </section>

  <!-- Final CTA -->
  <section class="bg-slate-900 py-20 px-6 text-center">
    <div class="max-w-2xl mx-auto">
      <h2 class="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
      <p class="text-slate-400 mb-8">${content.cta.secondary}</p>
      <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-12 py-4 rounded-full transition">
        ${content.cta.primary}
      </button>
    </div>
  </section>

  <footer class="bg-slate-900 border-t border-slate-800 py-6 text-center">
    <p class="text-slate-500 text-sm">Generated by AI Sales Page Generator</p>
  </footer>

</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
      "Content-Disposition": `attachment; filename="${page.productName.replace(/\s+/g, "-")}-sales-page.html"`,
    },
  });
}
