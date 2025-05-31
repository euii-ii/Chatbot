import { assets } from '@/assets/assets'
import Image from 'next/image'
import React from 'react'

const Message = ({ role, content }) => {
    return (
        <div className='flex flex-col items-center w-full max-w-4xl py-2'>
            <div className={`flex w-full mb-6 ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`group relative flex max-w-3xl rounded-lg ${
                    role === 'user' 
                        ? 'bg-[#414415] px-6 py-4' 
                        : 'bg-[#1e1e1e] px-4 py-4'
                }`}>
                    {role !== 'user' && (
                        <Image 
                            src={assets.logo_icon} 
                            alt='AI' 
                            className='h-8 w-8 mt-1 mr-4 border border-white/20 rounded-full' 
                        />
                    )}
                    
                    <div className={`relative ${role === 'user' ? 'text-white/90' : 'text-white/80'}`}>
                        {content}
                    </div>

                    <div className={`opacity-0 group-hover:opacity-100 absolute ${
                        role === 'user' 
                            ? '-left-20 top-2' 
                            : '-bottom-8 left-12'
                    } transition-opacity duration-200`}>
                        <div className='flex items-center gap-3 bg-[#2a2a2a] rounded-md px-2 py-1'>
                            {role === 'user' ? (
                                <>
                                    <Image src={assets.copy_icon} alt='Copy' className='w-4 h-4 cursor-pointer hover:opacity-80' />
                                    <Image src={assets.pencil_icon} alt='Edit' className='w-4 h-4 cursor-pointer hover:opacity-80' />
                                </>
                            ) : (
                                <>
                                    <Image src={assets.copy_icon} alt='Copy' className='w-4 h-4 cursor-pointer hover:opacity-80' />
                                    <Image src={assets.regenerate_icon} alt='Regenerate' className='w-4 h-4 cursor-pointer hover:opacity-80' />
                                    <Image src={assets.like_icon} alt='Like' className='w-4 h-4 cursor-pointer hover:opacity-80' />
                                    <Image src={assets.dislike_icon} alt='Dislike' className='w-4 h-4 cursor-pointer hover:opacity-80' />
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