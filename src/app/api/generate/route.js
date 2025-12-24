// app/api/generate/route.js
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    const ai = new GoogleGenAI({
      apiKey: "AIzaSyAJiC4EWmm-k9CoEcFZPLcBi-yfC_ruZfU",
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    // Try to parse JSON text and return an object
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
