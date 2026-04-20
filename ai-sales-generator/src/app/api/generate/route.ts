import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { groq } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      productName,
      description,
      features,
      targetAudience,
      price,
      usp,
      editId,
    } = await req.json();

    if (
      !productName ||
      !description ||
      !features ||
      !targetAudience ||
      !price
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const prompt = `
You are an expert copywriter and sales page designer.
Generate a complete, persuasive sales page for the following product.

Product Name: ${productName}
Description: ${description}
Key Features: ${features}
Target Audience: ${targetAudience}
Price: ${price}
Unique Selling Points: ${usp || "Not provided"}

Respond ONLY with a valid JSON object in this exact format, no markdown, no backticks, no explanation:
{
  "headline": "A powerful attention-grabbing headline",
  "subheadline": "A supporting subheadline that clarifies the value",
  "productDescription": "2-3 paragraph compelling product description",
  "benefits": [
    { "title": "Benefit 1", "description": "Short description" },
    { "title": "Benefit 2", "description": "Short description" },
    { "title": "Benefit 3", "description": "Short description" },
    { "title": "Benefit 4", "description": "Short description" }
  ],
  "features": [
    { "name": "Feature 1", "detail": "What it does" },
    { "name": "Feature 2", "detail": "What it does" },
    { "name": "Feature 3", "detail": "What it does" }
  ],
  "socialProof": {
    "testimonial1": { "name": "Customer Name", "role": "Job Title", "quote": "Testimonial quote" },
    "testimonial2": { "name": "Customer Name", "role": "Job Title", "quote": "Testimonial quote" },
    "testimonial3": { "name": "Customer Name", "role": "Job Title", "quote": "Testimonial quote" }
  },
  "pricing": {
    "price": "${price}",
    "description": "What is included in this price",
    "guarantee": "A money-back guarantee or risk-reversal statement"
  },
  "cta": {
    "primary": "Primary CTA button text",
    "secondary": "Secondary CTA text below the button"
  }
}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const raw = completion.choices[0].message.content || "";

    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let generatedContent;
    try {
      generatedContent = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 },
      );
    }

    let savedPage;

    if (editId) {
      // Update existing page
      savedPage = await prisma.salesPage.update({
        where: { id: editId },
        data: {
          productName,
          description,
          features,
          targetAudience,
          price,
          usp: usp || "",
          generatedContent: JSON.stringify(generatedContent),
        },
      });
    } else {
      // Create new page
      savedPage = await prisma.salesPage.create({
        data: {
          userId: session.user.id,
          productName,
          description,
          features,
          targetAudience,
          price,
          usp: usp || "",
          generatedContent: JSON.stringify(generatedContent),
        },
      });
    }

    return NextResponse.json({ id: savedPage.id }, { status: 201 });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
