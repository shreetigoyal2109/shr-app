import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  try {
    const { topics, days } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY as string;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY not found");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
Create a study plan.

Topics: ${topics}
Days: ${days}

Provide topics, subtopics and hours to study for each day.

Return ONLY valid JSON.
`;

    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();
    const cleanedText = responseText.replace(/```json|```/gi, "").trim();
    const parsedResponse = JSON.parse(cleanedText);

    return NextResponse.json(parsedResponse);
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}