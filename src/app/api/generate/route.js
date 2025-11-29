import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    const ai = new GoogleGenAI({
      apiKey: "API_KEY",
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    try {
      const parsed = JSON.parse(response.text);
      return NextResponse.json(parsed);
    } catch (e) {
      // fallback: return raw text
      return NextResponse.json({ text: response.text });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
