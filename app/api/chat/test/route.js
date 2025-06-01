import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check if API key exists
    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "No API key found. Set DEEPSEEK_API_KEY, OPENROUTER_API_KEY, or OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    // Determine configuration based on API key
    let baseURL, model;
    if (process.env.DEEPSEEK_API_KEY) {
      if (process.env.DEEPSEEK_API_KEY.startsWith('sk-or-')) {
        baseURL = 'https://openrouter.ai/api/v1';
        model = 'deepseek/deepseek-chat-v3';
      } else {
        baseURL = 'https://api.deepseek.com/v1';
        model = 'deepseek-chat';
      }
    } else if (process.env.OPENROUTER_API_KEY) {
      baseURL = 'https://openrouter.ai/api/v1';
      model = 'deepseek/deepseek-chat-v3';
    } else {
      baseURL = 'https://api.openai.com/v1';
      model = 'gpt-3.5-turbo';
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      baseURL: baseURL,
      apiKey: apiKey
    });

    // Test the API key with a simple request
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 10
    });

    return NextResponse.json({
      success: true,
      message: "API key is valid",
      response: completion.choices[0].message.content
    });

  } catch (error) {
    console.error('API Test Error:', error);
    
    if (error.status === 401) {
      return NextResponse.json(
        { success: false, message: "Invalid API key. Please get a new one from https://platform.deepseek.com/" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
