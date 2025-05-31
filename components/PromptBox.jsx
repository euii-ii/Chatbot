import { assets } from '@/assets/assets'
import React, { useState } from 'react'
import Image from 'next/image'

const PromptBox = ({setIsLoading, isLoading}) => {

           const [prompt, setPrompt] = useState('');

return (
    <form className='w-full max-w-2xl bg-[#404045] p-4 rounded-3xl mt-4 transition-all'>
            <textarea 
                    className='outline-none w-full resize-none overflow-hidden break-words bg-transparent text-white px-2 py-1' 
                    rows={2} 
                    placeholder='Message AI Assistant' 
                    required 
                    onChange={(e)=> setPrompt(e.target.value)} 
                    value={prompt}  
            />
            <div className='flex items-center justify-between mt-2'>
                    <div className='flex items-center gap-3'>
                            <button type="button" className='flex items-center gap-2 text-xs border border-gray-300/40 px-3 py-1.5 rounded-full hover:bg-gray-500/20 transition'>
                                    <Image className='h-4 w-4' src={assets.deepthink_icon} alt='DeepThink'/>
                                    DeepThink (R1)
                            </button>
                            <button type="button" className='flex items-center gap-2 text-xs border border-gray-300/40 px-3 py-1.5 rounded-full hover:bg-gray-500/20 transition'>
                                    <Image className='h-4 w-4' src={assets.search_icon} alt='Search'/>
                                    Search
                            </button>
                    </div>
                    <div className='flex items-center gap-3'>
                            <button type="button">
                                    <Image className='w-4 h-4 hover:opacity-80 transition' src={assets.pin_icon} alt='Pin'/>
                            </button>
                            <button 
                                    type="submit"
                                    className={`${prompt ? "bg-primary" : "bg-[#71717a]"} rounded-full p-2 hover:opacity-90 transition`}
                            >
                                    <Image 
                                            className='w-3.5 h-3.5' 
                                            src={prompt ? assets.arrow_icon : assets.arrow_icon_dull} 
                                            alt='Send'
                                    />
                            </button>
                    </div>
            </div>
    </form>
)
}

export default PromptBox