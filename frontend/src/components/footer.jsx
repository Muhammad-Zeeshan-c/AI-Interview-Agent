import React from 'react'
import { motion } from 'framer-motion'
import { BsRobot } from 'react-icons/bs'


function Footer() {
  return (
    <div className='bg-[linear-gradient(180deg,#f3f4f8_0%,#eef1f6_100%)] flex justify-center px-4 pb-10 pt-10 sm:px-6'>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className='w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 px-5 py-8 text-center shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-md sm:px-8'
      >
        <div className='mx-auto mb-4 flex w-fit items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-950 via-slate-800 to-slate-700 text-white shadow-lg shadow-slate-900/20'>
            <BsRobot size={16}/>
          </div>
          <h2 className='text-base font-semibold tracking-tight text-slate-950'>Ace.AI</h2>
        </div>
        <p className='mx-auto max-w-2xl text-sm leading-6 text-slate-500 sm:text-base'>
          An AI-powered interview practice platform built to sharpen communication, deepen technical readiness, and build calm confidence.
        </p>
        <div className='mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-slate-500'>
          <span className='rounded-full bg-slate-100 px-3 py-1'>Smart feedback</span>
          <span className='rounded-full bg-slate-100 px-3 py-1'>Clean UI</span>
          <span className='rounded-full bg-slate-100 px-3 py-1'>Responsive layout</span>
        </div>
      </motion.div>
    </div>
  )
}

export default Footer