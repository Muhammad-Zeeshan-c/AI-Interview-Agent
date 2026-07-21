import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {authService} from "../services/api/authService.js";
import { useDispatch } from "react-redux";
import AuthComponent from "./AuthComponent.jsx";

//React icons
import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";

function Navbar() {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const [showCreditsPopup, setShowCreditsPopup] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showAuth,setShowAuth]=useState(false)

  const navigate = useNavigate();

  const handleLogout = async () => {
    try{
        await authService.logout(dispatch);
        setShowProfilePopup(false);
        setShowCreditsPopup(false);
        navigate("/auth");

    }
    catch(error){
        console.error("Logout failed:", error);
    }
  }
  return (
    <div className="w-full bg-[#f3f3f3] flex justify-center px-6 pt-4">
      <motion.div
        intial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl bg-white rounded-lg shadow-sm border border-gray-200 px-8 py-4 flex justify-between items-center relative"
      >
        {/*Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="bg-black text-white p-2 rounded-lg">
            <BsRobot size={20} />
          </div>
          <h1 className="font-semibold hidden md:block text-lg">Ace.AI</h1>
        </div>

        {/*Credits */}

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => {
                if(!userData){
                    setShowAuth(true)
                    return;
                }
                setShowCreditsPopup(!showCreditsPopup);
                setShowProfilePopup(false);
              }}
              className="flex items-center bg-gray-100 px-4 py-2 rounded-full text-md hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
            >
              <BsCoin size={20} />
              {userData && (
                <span className="ml-2">{userData.credits || 0}</span>
              )}
            </button>

            {/*User credits Popup*/}
            {showCreditsPopup && (
              <div className="absolute right-12 mt-2 w-64 bg-white border border-white rounded-xl shadow-lg p-5 z-10 flex flex-col">
                <p className="text-center">Need more credits to continue?</p>
                <button className="mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200">
                  Buy Credits
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                if(!userData){
                    setShowAuth(true)
                    return;
                }
                setShowProfilePopup(!showProfilePopup);
                setShowCreditsPopup(false);
              }}
              className="w-9 h-9 bg-black hover:bg-gray-800 text-white rounded-full flex items-center justify-center font-semibold cursor-pointer"
            >
              {userData ? (
                userData?.name.slice(0, 1).toUpperCase()
              ) : (
                <FaUserAstronaut size={20} />
              )}
            </button>

            {/*User profile Popup*/}
            {showProfilePopup && (
              <div className="absolute right-0 top-full mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-2xl p-4 z-50 flex flex-col gap-1">
                {/* User Details */}
                <div className="pb-3 mb-2 border-b border-gray-100">
                  <p className="text-gray-900 font-semibold text-sm truncate">
                    {userData?.name}
                  </p>
                  <p className="text-gray-500 text-xs truncate">
                    {userData?.email}
                  </p>
                </div>

                {/* History Button */}
                <button className="w-full text-left text-sm py-2 px-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-150 font-medium">
                  History
                </button>

                {/* Logout Button */}
                <button 
                onClick={() => handleLogout()}
                className="w-full mt-1 text-sm py-2 px-3 bg-red-600 flex flex-row items-center justify-center gap-2 text-white font-medium rounded-lg hover:bg-red-700 active:scale-[0.98] transition-all duration-150 shadow-sm">
                  <HiOutlineLogout size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {
        showAuth && (
             <AuthComponent onClose={()=>setShowAuth(false)}/>
        )
      }
    </div>
  );
}

export default Navbar;
