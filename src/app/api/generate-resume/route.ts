import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { jobDescription, candidate } = body || {};
    if (!jobDescription) {
      return NextResponse.json({ message: 'jobDescription is required' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: 'Gemini API key is not configured on the server' },
        { status: 500 },
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert resume writer. Create a concise, ATS-friendly resume in clean markdown.
    - Tailor it to the following job description.
    - Use clear section headings: Summary, Skills (bullet list), Experience (reverse-chronological, bullet accomplishments with metrics), Projects (optional), Education.
    - Avoid tables and images. Keep it 1-2 pages max.
    - Prefer action verbs and quantify impact where reasonable.
    - Optimize for keyword coverage from the JD.
    ${candidate ? `\nCandidate context to consider:\n${candidate}\n` : ''}
    Job Description:\n${jobDescription}\n`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return NextResponse.json({ resume: text });
  } catch (err: any) {
    console.error('Gemini resume generation failed', err);
    return NextResponse.json(
      { message: err?.message || 'Failed to generate resume' },
      { status: 500 },
    );
  }
}
