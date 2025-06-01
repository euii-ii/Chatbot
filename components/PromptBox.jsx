import { assets } from '@/assets/assets'
import React, { useState } from 'react'
import Image from 'next/image'
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import axios from 'axios';

const PromptBox = ({setIsLoading, isLoading}) => {

           const [prompt, setPrompt] = useState('');
           const {user, setChats,selectedChat, setSelectedChat} = useAppContext();
           const {getToken} = useAuth();
          const handleKeyDown = (e)=>{
           if(e.key === 'Enter' && !e.shiftKey){
                e.preventDefault();
                sendPrompt(e);
           }
          }

           const sendPrompt = async (e) =>{
                const promptCopy = prompt;
                try {
                     e.preventDefault();
                     if(!user) return toast.error('login to send message');
                     if(isLoading) return toast.error('wait for the previous message to load');   
                     setIsLoading(true)
                     setPrompt("")
                     const userPrompt = {

                         role: "user",
                         content: prompt,
                        timestamp: Date.now()
                     }
                     setChats((prevChats)=> prevChats.map((chat)=> chat._id === selectedChat._id?{
                              ...chat,
                              messages: [...chat.messages, userPrompt]
                     }:chat
                ))
                setSelectedChat ((prev)=> ({
                        ...prev, 
                        messages: [...prev.messages, userPrompt]
                }));

                const token = await getToken();

                // Create a temporary streaming message
                const streamingMessage = {
                    role: "assistant",
                    content: "",
                    timestamp: Date.now(),
                    isStreaming: true
                };

                // Add streaming message to UI immediately
                setChats((prevChats)=> prevChats.map((chat)=> chat._id === selectedChat._id?{
                    ...chat,
                    messages: [...chat.messages, streamingMessage]
                }:chat))

                setSelectedChat((prev)=> ({
                    ...prev,
                    messages: [...prev.messages, streamingMessage]
                }));

                // Start streaming request
                const response = await fetch('/api/chat/ai', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        chatId: selectedChat._id,
                        prompt: promptCopy
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to get AI response');
                }

                // Check if response is streaming
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('text/event-stream')) {
                    // Handle streaming response
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    let fullContent = '';

                    try {
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;

                            const chunk = decoder.decode(value);
                            const lines = chunk.split('\n');

                            for (const line of lines) {
                                if (line.startsWith('data: ')) {
                                    try {
                                        const data = JSON.parse(line.slice(6));

                                        if (data.type === 'chunk') {
                                            fullContent = data.fullContent;

                                            // Update streaming message in real-time
                                            setChats((prevChats)=> prevChats.map((chat)=> chat._id === selectedChat._id?{
                                                ...chat,
                                                messages: chat.messages.map((msg, index) =>
                                                    index === chat.messages.length - 1 && msg.isStreaming ?
                                                    { ...msg, content: fullContent } : msg
                                                )
                                            }:chat))

                                            setSelectedChat((prev)=> ({
                                                ...prev,
                                                messages: prev.messages.map((msg, index) =>
                                                    index === prev.messages.length - 1 && msg.isStreaming ?
                                                    { ...msg, content: fullContent } : msg
                                                )
                                            }));
                                        } else if (data.type === 'complete') {
                                            // Replace streaming message with final message
                                            const finalMessage = { ...data.message, isStreaming: false };

                                            setChats((prevChats)=> prevChats.map((chat)=> chat._id === selectedChat._id?{
                                                ...chat,
                                                messages: chat.messages.map((msg, index) =>
                                                    index === chat.messages.length - 1 && msg.isStreaming ?
                                                    finalMessage : msg
                                                )
                                            }:chat))

                                            setSelectedChat((prev)=> ({
                                                ...prev,
                                                messages: prev.messages.map((msg, index) =>
                                                    index === prev.messages.length - 1 && msg.isStreaming ?
                                                    finalMessage : msg
                                                )
                                            }));
                                            break;
                                        } else if (data.type === 'error') {
                                            throw new Error(data.message);
                                        }
                                    } catch (parseError) {
                                        console.error('Error parsing streaming data:', parseError);
                                    }
                                }
                            }
                        }
                    } finally {
                        reader.releaseLock();
                    }
                } else {
                    // Handle non-streaming response (fallback)
                    const data = await response.json();
                    if(data.success){
                        const assistantMessage = data.data;

                        // Replace streaming message with final message
                        setChats((prevChats)=> prevChats.map((chat)=> chat._id === selectedChat._id?{
                            ...chat,
                            messages: chat.messages.map((msg, index) =>
                                index === chat.messages.length - 1 && msg.isStreaming ?
                                assistantMessage : msg
                            )
                        }:chat))

                        setSelectedChat((prev)=> ({
                            ...prev,
                            messages: prev.messages.map((msg, index) =>
                                index === prev.messages.length - 1 && msg.isStreaming ?
                                assistantMessage : msg
                            )
                        }));
                    } else {
                        throw new Error(data.message);
                    }
                }
                } catch (error) {
                      toast.error(error.message);
                        setPrompt(promptCopy);  
                } finally{
                        setIsLoading(false);
                }

           }
return (
        <form onSubmit={sendPrompt}
        className={`w-full max-w-4xl xl:max-w-5xl p-3 sm:p-4 lg:p-5 xl:p-6 rounded-2xl sm:rounded-3xl transition-all duration-300 ${
                isLoading
                        ? 'bg-gradient-to-r from-gray-800/60 to-gray-700/60 border-2 border-blue-400/30 shadow-lg shadow-blue-500/20'
                        : 'bg-[#404045] hover:bg-[#454550]'
        }`}>
                        <textarea onKeyDown={handleKeyDown}
                                        className='outline-none w-full resize-none overflow-hidden break-words bg-transparent text-white px-1 sm:px-2 lg:px-3 xl:px-4 py-1 lg:py-2 text-sm sm:text-base lg:text-lg'
                                        rows={2}
                                        placeholder='Message AI Assistant'
                                        required
                                        onChange={(e)=> setPrompt(e.target.value)}
                                        value={prompt}
                                        disabled={isLoading}
                        />
                        <div className='flex items-center justify-between mt-2'>
                                        <div className='flex items-center gap-1 sm:gap-2 lg:gap-3'>
                                                        <button type="button" className='hidden sm:flex items-center gap-1 sm:gap-2 lg:gap-3 text-xs lg:text-sm border border-gray-300/40 px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full hover:bg-gray-500/20 transition'>
                                                                        <Image className='h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5' src={assets.deepthink_icon} alt='DeepThink' width={16} height={16} />
                                                                        <span className='hidden sm:inline'>DeepThink (R1)</span>
                                                        </button>
                                                        <button type="button" className='hidden sm:flex items-center gap-1 sm:gap-2 lg:gap-3 text-xs lg:text-sm border border-gray-300/40 px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full hover:bg-gray-500/20 transition'>
                                                                        <Image className='h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5' src={assets.search_icon} alt='Search' width={16} height={16} />
                                                                        <span className='hidden sm:inline'>Search</span>
                                                        </button>
                                        </div>
                                        <div className='flex items-center gap-2 sm:gap-3'>
                                                        <button type="button" className='hidden sm:block'>
                                                                        <Image className='w-3 h-3 sm:w-4 sm:h-4 hover:opacity-80 transition' src={assets.pin_icon} alt='Pin' width={16} height={16} />
                                                        </button>
                                                        <button
                                                                        type="submit"
                                                                        className={`group relative rounded-full p-3 sm:p-3.5 lg:p-4 transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                                                                                isLoading
                                                                                        ? "bg-gradient-to-r from-gray-600 to-gray-700 cursor-not-allowed shadow-lg shadow-gray-500/20"
                                                                                        : prompt
                                                                                                ? "bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/40"
                                                                                                : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 shadow-lg shadow-gray-500/20"
                                                                        }`}
                                                                        disabled={isLoading}
                                                                        title={isLoading ? "AI is responding..." : prompt ? "Send message" : "Type a message to send"}
                                                        >
                                                                        {/* Background glow effect */}
                                                                        {prompt && !isLoading && (
                                                                                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
                                                                        )}

                                                                        {/* Button content */}
                                                                        <div className="relative flex items-center justify-center">
                                                                                {isLoading ? (
                                                                                        <div className="flex gap-1">
                                                                                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                                                                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                                                                                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                                                                                        </div>
                                                                                ) : (
                                                                                        <div className={`transition-all duration-300 ${prompt ? 'transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5' : ''}`}>
                                                                                                {prompt ? (
                                                                                                        // Active send arrow with enhanced styling
                                                                                                        <svg
                                                                                                                className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white drop-shadow-sm"
                                                                                                                fill="currentColor"
                                                                                                                viewBox="0 0 24 24"
                                                                                                        >
                                                                                                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                                                                                        </svg>
                                                                                                ) : (
                                                                                                        // Inactive send arrow
                                                                                                        <svg
                                                                                                                className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-300 opacity-60"
                                                                                                                fill="currentColor"
                                                                                                                viewBox="0 0 24 24"
                                                                                                        >
                                                                                                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                                                                                        </svg>
                                                                                                )}
                                                                                        </div>
                                                                                )}
                                                                        </div>

                                                                        {/* Ripple effect on click */}
                                                                        {prompt && !isLoading && (
                                                                                <div className="absolute inset-0 rounded-full opacity-0 group-active:opacity-30 bg-white transition-opacity duration-150"></div>
                                                                        )}
                                                        </button>
                                        </div>
                        </div>
        </form>
)
}

export default PromptBox