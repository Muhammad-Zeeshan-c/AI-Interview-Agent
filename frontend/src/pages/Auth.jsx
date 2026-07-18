import React from 'react'
import {motion} from 'motion/react'


//React Icons
import { FaRobot } from "react-icons/fa6";
import { IoSparklesSharp } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";




function Auth(){
    return(
    <div className='w-full min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20'>
        <motion.div 
        initial={{opacity:0,y:-40}}
        animate={{opacity:1,y:0}}
        transition={{duration:1.5,ease: "easeOut"}}
        className='w-full max-w-md p-8 rounded-3xl bg-white shadow-2xl border border-gray-200'>
            <div className='flex items-center justify-center gap-3 mb-6'>
                <div className='bg-black text-white p-2 rounded-lg'>
                    <FaRobot size={34}/>
                </div>
                <h1 className='text-lg font-bold font-sans'>Aced.ai</h1>
            </div>
            <div className='text-2xl md:text-3xl font-semibold text-center leading-snug mb-4'>
                <h1 className='mb-2'>Continue With </h1>
                <span className='bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2'>
                    <IoSparklesSharp size={16}/> Aced.ai
                </span>
            </div>

            <p className='text-gray-500 text-center text-sm md:text-base leading-relaxed mb-8'>
               Sign in to ace your next interview. Practice with AI, track your progress, and access detailed feedback.
            </p>
            <motion.button
            whileHover={{opacity:0.9, scale:1.03}}
            whileTap={{opacity:1,scale:0.98}}
            className='w-full flex items-center justify-center gap-3 py-3 bg-black text-white rounded-full shadow-md'
            >
                <FcGoogle size={20}/>
                Continue with Google
            </motion.button>
        </motion.div>
    </div>)
}

export default Auth