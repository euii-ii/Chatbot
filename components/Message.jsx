import { assets } from '@/assets/assets'
import Image from 'next/image'
import React from 'react'
import Markdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import toast from 'react-hot-toast'

const Message = ({ role, content, isStreaming, isLastMessage, onRegenerate }) => {
    const copyMessage = () => {
        navigator.clipboard.writeText(content)
        toast.success('Message copied to clipboard!')
    }

    const handleEdit = () => {
        // TODO: Implement edit functionality
        toast.success('Edit functionality coming soon!')
    }

    const handleRegenerate = () => {
        if (onRegenerate) {
            onRegenerate()
        } else {
            toast.error('Regenerate function not available')
        }
    }


    return (
        <div className='w-full py-1 sm:py-2'>
            <div className={`flex w-full ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`group relative flex ${
                    role === 'user'
                        ? 'max-w-[85%] sm:max-w-[75%] lg:max-w-[65%] px-3 sm:px-4 py-2 sm:py-3 text-white'
                        : 'w-full max-w-[95%] sm:max-w-[85%] lg:max-w-4xl xl:max-w-5xl text-white'
                } ${
                    isStreaming && role !== 'user'
                        ? 'px-3 sm:px-4 py-2 sm:py-3 animate-pulse'
                        : role !== 'user' ? 'px-3 sm:px-4 py-2 sm:py-3' : ''
                } transition-all duration-300`}>
                    {role !== 'user' && (
                        <Image
                            src={assets.logo_icon}
                            alt='AI'
                            className='h-6 w-6 sm:h-7 sm:w-7 mt-1 mr-2 sm:mr-3 rounded-full flex-shrink-0'
                            width={32}
                            height={32}
                        />
                    )}
                    
                    <div className={`relative text-white flex-1 min-w-0`}>
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

                    {/* Clean action buttons - just icons, no containers */}
                    <div className={`opacity-100 absolute ${
                        role === 'user'
                            ? '-left-16 sm:-left-18 top-2 sm:top-3'
                            : '-bottom-6 sm:-bottom-7 left-8 sm:left-10'
                    } transition-opacity duration-200 z-10`}>
                        <div className='flex items-center gap-1'>
                            {role === 'user' ? (
                                <>
                                    <button
                                        onClick={copyMessage}
                                        className='hover:scale-110 transition-transform duration-200'
                                        title="Copy message"
                                    >
                                        <Image src={assets.copy_icon} alt='Copy' className='w-4 h-4 opacity-70 hover:opacity-100' width={16} height={16} />
                                    </button>
                                    <button
                                        onClick={handleEdit}
                                        className='hover:scale-110 transition-transform duration-200'
                                        title="Edit message"
                                    >
                                        <Image src={assets.pencil_icon} alt='Edit' className='w-4 h-4 opacity-70 hover:opacity-100' width={16} height={16} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={copyMessage}
                                        className='hover:scale-110 transition-transform duration-200'
                                        title="Copy message"
                                    >
                                        <Image src={assets.copy_icon} alt='Copy' className='w-4 h-4 opacity-70 hover:opacity-100' width={16} height={16} />
                                    </button>
                                    <button
                                        onClick={handleRegenerate}
                                        className='hover:scale-110 hover:rotate-180 transition-all duration-300'
                                        title="Regenerate response"
                                    >
                                        <Image src={assets.regenerate_icon} alt='Regenerate' className='w-4 h-4 opacity-70 hover:opacity-100' width={16} height={16} />
                                    </button>
                                    <button
                                        className='hover:scale-110 transition-transform duration-200'
                                        title="Like response"
                                    >
                                        <Image src={assets.like_icon} alt='Like' className='w-4 h-4 opacity-70 hover:opacity-100' width={16} height={16} />
                                    </button>
                                    <button
                                        className='hover:scale-110 transition-transform duration-200'
                                        title="Dislike response"
                                    >
                                        <Image src={assets.dislike_icon} alt='Dislike' className='w-4 h-4 opacity-70 hover:opacity-100' width={16} height={16} />
                                    </button>
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