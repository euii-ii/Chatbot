import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getAuth } from "@clerk/nextjs/server";
import Chat from "@/models/Chat";
import connectDB from "@/config/db";

// Support OpenRouter, DeepSeek, and OpenAI
const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || process.env.OPENROUTER_API_KEY;
let baseURL, model;

if (process.env.DEEPSEEK_API_KEY) {
    // Check if it's an OpenRouter key (starts with sk-or-)
    if (process.env.DEEPSEEK_API_KEY.startsWith('sk-or-')) {
        baseURL = 'https://openrouter.ai/api/v1';
        model = 'deepseek/deepseek-chat';
    } else {
        baseURL = 'https://api.deepseek.com/v1';
        model = 'deepseek-chat';
    }
} else if (process.env.OPENROUTER_API_KEY) {
    baseURL = 'https://openrouter.ai/api/v1';
    model = 'deepseek/deepseek-chat';
} else if (process.env.OPENAI_API_KEY) {
    baseURL = 'https://api.openai.com/v1';
    model = 'gpt-3.5-turbo';
}

const openai = new OpenAI({
    baseURL: baseURL,
    apiKey: apiKey
});

export async function POST(request) {
    try {
        const {userId} = getAuth(request);
        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { chatId, prompt } = await request.json();

        if (!chatId || !prompt) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        await connectDB();
        const chat = await Chat.findOne({ _id: chatId, userId });

        if (!chat) {
            return NextResponse.json(
                { success: false, message: "Chat not found" },
                { status: 404 }
            );
        }

        // Use DeepSeek model
        const model = "deepseek-chat";

        // Create streaming response
        const stream = new ReadableStream({
            async start(controller) {
                const encoder = new TextEncoder();
                
                try {
                    // Build conversation messages for context
                    const conversationMessages = [
                        {
                            role: "system",
                            content: "You are a helpful AI assistant. Provide accurate, detailed, and well-formatted responses. When providing code, use proper syntax highlighting and explain the code clearly. Be concise but comprehensive."
                        }
                    ];

                    // Add recent conversation history (last 10 messages for context)
                    const recentMessages = chat.messages.slice(-10).map(msg => ({
                        role: msg.role,
                        content: msg.content
                    }));

                    conversationMessages.push(...recentMessages);

                    // Add the current user prompt for regeneration
                    conversationMessages.push({ role: "user", content: prompt });

                    const completion = await openai.chat.completions.create({
                        model: model,
                        messages: conversationMessages,
                        stream: true,
                        max_tokens: 4000,
                        temperature: 0.7,
                    });

                    let fullContent = '';

                    for await (const chunk of completion) {
                        const content = chunk.choices[0]?.delta?.content || '';
                        if (content) {
                            fullContent += content;
                            
                            // Send streaming data
                            const data = JSON.stringify({
                                content: content,
                                fullContent: fullContent
                            });
                            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
                        }
                    }

                    // Add the regenerated AI response to chat history
                    const aiResponse = {
                        role: "assistant",
                        content: fullContent,
                        timestamp: Date.now()
                    };
                    chat.messages.push(aiResponse);
                    await chat.save();

                    // Send completion signal
                    controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
                    controller.close();

                } catch (error) {
                    console.error('Regeneration streaming error:', error);
                    const errorData = JSON.stringify({
                        error: 'Failed to regenerate response',
                        details: error.message
                    });
                    controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });

    } catch (error) {
        console.error('Regenerate API error:', error);
        return NextResponse.json(
            { success: false, message: "Internal server error", error: error.message },
            { status: 500 }
        );
    }
}
