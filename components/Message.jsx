import { assets } from '@/assets/assets'
import Image from 'next/image'
import React from 'react'
import Markdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import toast from 'react-hot-toast'

const Message = ({ role, content, isStreaming }) => {
    const copyMessage = () => {
        navigator.clipboard.writeText(content)
        toast.success('Message copied to clipboard!')
    }


    return (
        <div className='w-full py-2 sm:py-3 lg:py-4'>
            <div className={`flex w-full ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`group relative flex w-full max-w-[95%] sm:max-w-[85%] lg:max-w-4xl xl:max-w-5xl ${
                    role === 'user'
                        ? 'px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-5'
                        : isStreaming
                            ? 'px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-5 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl sm:rounded-2xl border border-blue-500/20 backdrop-blur-sm animate-pulse'
                            : 'px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-5'
                }`}>
                    {role !== 'user' && (
                        <Image
                            src={assets.logo_icon}
                            alt='AI'
                            className='h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 xl:h-9 xl:w-9 mt-1 mr-2 sm:mr-3 lg:mr-4 xl:mr-5 border border-white/20 rounded-full flex-shrink-0'
                            width={32}
                            height={32}
                        />
                    )}
                    
                    <div className={`relative ${role === 'user' ? 'text-white/90' : 'text-white/80'} flex-1 min-w-0`}>
                        <Markdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '')
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={match[1]}
                                            PreTag="div"
                                            className="rounded-md my-2"
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className="bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
                                            {children}
                                        </code>
                                    )
                                },
                                pre({ children }) {
                                    return <>{children}</>
                                },
                                p({ children }) {
                                    return <p className="mb-2 leading-relaxed">{children}</p>
                                },
                                h1({ children }) {
                                    return <h1 className="text-2xl font-bold mb-3 text-white">{children}</h1>
                                },
                                h2({ children }) {
                                    return <h2 className="text-xl font-semibold mb-2 text-white">{children}</h2>
                                },
                                h3({ children }) {
                                    return <h3 className="text-lg font-medium mb-2 text-white">{children}</h3>
                                },
                                ul({ children }) {
                                    return <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>
                                },
                                ol({ children }) {
                                    return <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>
                                },
                                li({ children }) {
                                    return <li className="ml-2">{children}</li>
                                },
                                blockquote({ children }) {
                                    return <blockquote className="border-l-4 border-gray-500 pl-4 italic my-2">{children}</blockquote>
                                },
                                strong({ children }) {
                                    return <strong className="font-semibold text-white">{children}</strong>
                                },
                                em({ children }) {
                                    return <em className="italic">{children}</em>
                                }
                            }}
                        >
                            {content}
                        </Markdown>
                        {isStreaming && (
                            <div className="inline-flex items-center ml-2">
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                                </div>
                                <span className="ml-2 text-xs text-blue-300 opacity-75">typing...</span>
                            </div>
                        )}
                    </div>

                    <div className={`opacity-0 group-hover:opacity-100 absolute ${
                        role === 'user' 
                            ? '-left-20 top-2' 
                            : '-bottom-8 left-12'
                    } transition-opacity duration-200`}>
                        <div className='flex items-center gap-3 bg-[#2a2a2a] rounded-md px-2 py-1'>
                            {role === 'user' ? (
                                <>
                                    <Image onClick={copyMessage }  src={assets.copy_icon} alt='Copy' className='w-4 h-4 cursor-pointer hover:opacity-80' width={16} height={16} />
                                    <Image src={assets.pencil_icon} alt='Edit' className='w-4 h-4 cursor-pointer hover:opacity-80' width={16} height={16} />
                                </>
                            ) : (
                                <>
                                    <Image onClick={copyMessage }  src={assets.copy_icon} alt='Copy' className='w-4 h-4 cursor-pointer hover:opacity-80' width={16} height={16} />
                                    <Image src={assets.regenerate_icon} alt='Regenerate' className='w-4 h-4 cursor-pointer hover:opacity-80' width={16} height={16} />
                                    <Image src={assets.like_icon} alt='Like' className='w-4 h-4 cursor-pointer hover:opacity-80' width={16} height={16} />
                                    <Image src={assets.dislike_icon} alt='Dislike' className='w-4 h-4 cursor-pointer hover:opacity-80' width={16} height={16} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Message      