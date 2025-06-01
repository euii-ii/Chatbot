'use client';
import { assets } from "@/assets/assets";
import Message from "@/components/Message";
import PromptBox from "@/components/PromptBox";
import Sidebar from "@/components/Sidebar";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import {useEffect, useState, useRef} from "react";

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
            <p className="border border-transparent hover:border-gray-500/50 py-1 px-2 sm:px-3 rounded-lg font-semibold text-sm sm:text-base bg-black/50 backdrop-blur-sm max-w-[90%] truncate">{selectedChat.name}</p>
          </div>
          <div ref={containerRef} className="flex-1 overflow-y-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-4 max-w-6xl mx-auto w-full">{/* Messages container */}
         {messages.map((msg, index)=>(
            <Message key={index}
              role={msg.role}
              content={msg.content}
              isStreaming={msg.isStreaming || false}
            />
        ))}
          {
            isLoading &&(
              <div className="flex gap-2 sm:gap-4 max-w-3xl w-full py-4 sm:py-6 px-3 sm:px-4 bg-gradient-to-r from-gray-800/30 to-gray-700/30 rounded-xl sm:rounded-2xl border border-gray-600/20 backdrop-blur-sm mx-2 sm:mx-0">
                <div className="relative">
                  <Image className="h-10 w-10 p-1.5 border-2 border-blue-400/50 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 animate-pulse" src={assets.logo_icon} alt="Logo" width={40} height={40} />
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
        <div className="border-t border-gray-700/50 bg-[#292a2d] px-2 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4">
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
