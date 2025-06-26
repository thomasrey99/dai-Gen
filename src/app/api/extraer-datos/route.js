import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import {buildPrompt} from "../../../utils/prompt"

const openai = new OpenAI({
  apiKey: process.env.CHAT_GPT_KEY,
});

export async function POST(req) {
  try {
    const { body } = await req.json();

    if (!body || typeof body !== 'string') {
      return NextResponse.json({ error: 'Prompt inválido' }, { status: 400 });
    }

    const messages = buildPrompt(body);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages,
    });

    const result = completion.choices[0]?.message?.content;

    return NextResponse.json({ response: result });

  } catch (error) {
    console.error('OpenAI Error:', error);
    return NextResponse.json({ error: 'Error al procesar el prompt' }, { status: 500 });
  }
}
