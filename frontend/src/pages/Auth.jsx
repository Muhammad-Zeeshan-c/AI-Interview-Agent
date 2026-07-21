import React,{useState} from 'react'
import axios from 'axios'
import {motion} from 'motion/react'
import {signInWithPopup} from 'firebase/auth'
import {auth,provider} from '../utils/firebase'
import {authService} from '../services/api/authService'
import {setUserData} from '../redux/userSlice/userSlice'
import {useDispatch} from 'react-redux'


//React Icons
import { FaRobot } from "react-icons/fa6";
import { IoSparklesSharp } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";




function Auth({isModel=false}){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch=useDispatch()


    const handleGoogleAuth=async ()=>{
        setLoading(true);
        setError(null);

        try{
            const response=await signInWithPopup(auth,provider)
            const displayName=response.user.displayName;
            const email=response.user.email
            const login=await authService.loginWithGoogle(displayName,email);
            console.log("Login Response:", login);
            dispatch(setUserData(login))
        }
        catch(error){
            console.error("Authentication failed:", error)
            dispatch(setUserData(null))
            setError(error.message || "An unexpected error occurred during sign-in.");
        }
        finally{
            setLoading(false)
        }
    }
    return (
        <div className={`
            w-full  ${isModel ? 'py-4' : 'min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20'}
        `}>
            <motion.div 
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`w-full ${isModel ? 'max-w-md p-8 rounded-3xl' : 'max-w-lg p-12 rounded-4xl'} bg-white  shadow-2xl border border-gray-200`}
            >
                <div className='flex items-center justify-center gap-3 mb-6'>
                    <div className='bg-black text-white p-2 rounded-lg'>
                        <FaRobot size={34}/>
                    </div>
                    <h1 className='text-lg font-bold font-sans'>Aced.ai</h1>
                </div>

                <div className='text-2xl md:text-3xl font-semibold text-center leading-snug mb-4'>
                    <h1 className='mb-2'>Continue With </h1>
                    <span className='bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2 text-base md:text-lg'>
                        <IoSparklesSharp size={16}/> Aced.ai
                    </span>
                </div>

                <p className='text-gray-500 text-center text-sm md:text-base leading-relaxed mb-6'>
                   Sign in to ace your next interview. Practice with AI, track your progress, and access detailed feedback.
                </p>

                {/* Error Banner Notification */}
                {error && (
                    <div className="mb-6 text-center text-xs md:text-sm font-medium text-red-600 bg-red-50 p-3 rounded-2xl border border-red-200">
                        {error}
                    </div>
                )}

                <motion.button
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    whileHover={loading ? {} : { opacity: 0.9, scale: 1.03 }}
                    whileTap={loading ? {} : { opacity: 1, scale: 0.98 }}
                    className={`w-full flex items-center justify-center gap-3 py-3 bg-black text-white rounded-full shadow-md transition-all ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {!loading && <FcGoogle size={20}/>}
                    {loading ? "Connecting..." : "Continue with Google"}
                </motion.button>
            </motion.div>
        </div>
    );
}

export default Auth
