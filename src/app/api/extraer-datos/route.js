import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import pdfParse from 'pdf-parse';
import { buildPrompt } from '../../../utils/prompt';
import { AppError, handleApiError, ErrorCodes } from '../../../utils/error-handler';

const openai = new OpenAI({
  apiKey: process.env.CHAT_GPT_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      throw new AppError('No se envió ningún archivo', ErrorCodes.VALIDATION_ERROR, 400);
    }

    if (file.type !== 'application/pdf') {
      throw new AppError('El archivo debe ser un PDF', ErrorCodes.VALIDATION_ERROR, 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const data = await pdfParse(buffer);
    const text = data.text;

    if (!text || text.trim().length < 10) {
      throw new AppError('No se pudo extraer texto del PDF', ErrorCodes.PDF_ERROR, 400);
    }

    const messages = buildPrompt(text);

    const completion = await openai.chat.completions.create({
      model: 'gpt-5.4',
      messages,
    });

    let result = completion.choices[0]?.message?.content;

    if (!result) {
      throw new AppError('Respuesta vacía de OpenAI', ErrorCodes.AI_ERROR, 500);
    }

    result = result
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(result);
    } catch (err) {
      console.error('Error parseando JSON:', result);
      throw new AppError('La IA devolvió un formato inválido', ErrorCodes.PARSE_ERROR, 500, 'Error al procesar la respuesta de la IA');
    }

    return NextResponse.json({
      success: true,
      response: parsed,
    });

  } catch (error) {
    return handleApiError(error, NextResponse);
  }
}