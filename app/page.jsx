'use client';
import { assets } from "@/assets/assets";
import Message from "@/components/Message";
import PromptBox from "@/components/PromptBox";
import Sidebar from "@/components/Sidebar";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import {useEffect, useState, useRef} from "react";
import toast from "react-hot-toast";

export default function Home() {
const [expand, setExpand] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [messages, setMessages] = useState([]);
const { selectedChat } = useAppContext();
const containerRef = useRef(null);
useEffect(() => {
  if (selectedChat) {
    setMessages(selectedChat.messages);
  }
}, [selectedChat]);

useEffect(() => {
  if (containerRef.current) {
    containerRef.current.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }
}, [selectedChat]);

// Handle regenerate functionality
const handleRegenerate = async (messageIndex) => {
  console.log('🔄 Starting regenerate for message index:', messageIndex)
  console.log('📋 Selected chat:', selectedChat)
  console.log('🆔 Chat ID:', selectedChat?._id)

  if (isLoading) {
    toast.error('Please wait for the current response to complete')
    return // Prevent multiple regenerations
  }

  const messageToRegenerate = messages[messageIndex]

  if (!messageToRegenerate || messageToRegenerate.role !== 'assistant') {
    toast.error('Can only regenerate AI responses')
    return
  }

  // Find the user message that prompted this AI response
  let userMessage = null

  for (let i = messageIndex - 1; i >= 0; i--) {
    if (messages[i].role === 'user') {
      userMessage = messages[i]
      break
    }
  }

  if (!userMessage) {
    toast.error('Cannot find the original user message')
    return
  }

  if (!selectedChat?._id) {
    console.log('❌ No chat selected, creating new chat...')
    toast.error('No chat selected. Please start a new conversation first.')
    return
  }

  if (!userMessage.content || userMessage.content.trim() === '') {
    toast.error('User message is empty')
    return
  }

  try {
    setIsLoading(true)
    toast.loading('Regenerating response...', { id: 'regenerate' })

    // Remove the AI message and all messages after it
    const newMessages = messages.slice(0, messageIndex)
    setMessages(newMessages)

    // Regenerate the AI response using existing endpoint with isRegenerate flag
    const response = await fetch('/api/chat/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: userMessage.content.trim(),
        chatId: selectedChat._id,
        isRegenerate: true,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to regenerate response: ${response.status} ${errorText}`)
    }

    // Check if response is streaming or JSON
    const contentType = response.headers.get('content-type')

    if (contentType && contentType.includes('text/event-stream')) {
      // Handle streaming response
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let aiResponse = ''

      // Add streaming AI message
      const streamingMessage = {
        role: 'assistant',
        content: '',
        isStreaming: true
      }
      setMessages(prev => [...prev, streamingMessage])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.content) {
                aiResponse += data.content
                setMessages(prev => prev.map((msg, idx) =>
                  idx === prev.length - 1
                    ? { ...msg, content: aiResponse }
                    : msg
                ))
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }

      // Mark streaming as complete
      setMessages(prev => prev.map((msg, idx) =>
        idx === prev.length - 1
          ? { ...msg, isStreaming: false }
          : msg
      ))
    } else {
      // Handle JSON response (fallback mode)
      const result = await response.json()

      if (result.success && result.data) {
        const newMessage = {
          role: 'assistant',
          content: result.data.content,
          isStreaming: false
        }
        setMessages(prev => [...prev, newMessage])
      } else {
        throw new Error(result.message || 'Failed to get AI response')
      }
    }

    toast.success('Response regenerated successfully!', { id: 'regenerate' })

  } catch (error) {
    console.error('Regeneration error:', error)
    toast.error(`Failed to regenerate: ${error.message}`, { id: 'regenerate' })

    // Restore the original message if regeneration failed
    setMessages(messages)
  } finally {
    setIsLoading(false)
  }
};
  return (
    <div className="h-screen overflow-hidden">
      {/* Mobile overlay */}
      {expand && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setExpand(false)}
        />
      )}
      <div className="flex h-full">
      <Sidebar expand={expand} setExpand={setExpand} />
      <div className="flex-1 flex flex-col bg-[#292a2d] text-white relative overflow-hidden" >
        <div className="md:hidden absolute px-2 sm:px-4 top-4 sm:top-6 flex items-center justify-between w-full z-20">
          <Image onClick={()=> (expand ? setExpand(false) : setExpand(true) )}
          className="rotate-180 w-6 h-6 sm:w-7 sm:h-7" src={assets.menu_icon} alt="" width={28} height={28} />
          <Image className="opacity-70 w-5 h-5 sm:w-6 sm:h-6" src={assets.chat_icon} alt="" width={24} height={24} />
        </div>
        {!selectedChat || selectedChat.messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 xl:px-12 pt-16 sm:pt-20 md:pt-0 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
            <Image src={assets.logo_icon} alt="" className="h-12 sm:h-14 lg:h-16 xl:h-18 w-12 sm:w-14 lg:w-16 xl:w-18" width={64} height={64} />
            <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-medium text-center sm:text-left">HI I'am Your Personal Assistant.</p>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-300">How Can I Help You Today?</p>
          </div>
        ):
        (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-center py-2 sm:py-3 border-b border-gray-700/50">
            <p className="py-1 px-2 sm:px-3 rounded-lg font-semibold text-sm sm:text-base max-w-[90%] truncate">{selectedChat.name}</p>
          </div>
          <div ref={containerRef} className="flex-1 overflow-y-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-4 max-w-6xl mx-auto w-full">{/* Messages container */}
         {messages.map((msg, index)=>(
            <Message key={index}
              role={msg.role}
              content={msg.content}
              isStreaming={msg.isStreaming || false}
              isLastMessage={index === messages.length - 1}
              onRegenerate={() => handleRegenerate(index)}
            />
        ))}
          {
            isLoading &&(
              <div className="flex gap-2 sm:gap-4 max-w-3xl w-full py-4 sm:py-6 px-3 sm:px-4 mx-2 sm:mx-0">
                <div className="relative">
                  <Image className="h-10 w-10 p-1.5 rounded-full animate-pulse" src={assets.logo_icon} alt="Logo" width={40} height={40} />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex flex-col justify-center flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                    <span className="text-blue-300 text-xs sm:text-sm font-medium">AI is generating response...</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 opacity-75">This may take 10-30 seconds for complex responses</p>
                </div>
              </div>
            )
          }
          </div>
        </div>
        )
        }

        {/* Prompt Box - Fixed at bottom */}
        <div className="border-t border-gray-700/50 px-2 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4">
          <div className="max-w-6xl mx-auto w-full">
            <PromptBox isLoading={isLoading} setIsLoading={setIsLoading} />
            <p className="text-xs text-center text-gray-500 mt-2">AI-generated, for reference only</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
