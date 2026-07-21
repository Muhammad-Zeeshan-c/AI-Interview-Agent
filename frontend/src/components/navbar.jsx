import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api/authService.js";
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
  const [showAuth, setShowAuth] = useState(false);

  const navigate = useNavigate();

  const popupVariants = {
    hidden: { opacity: 0, y: -8, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -8, scale: 0.98 },
  };

  const handleLogout = async () => {
    try {
      await authService.logout(dispatch);
      setShowProfilePopup(false);
      setShowCreditsPopup(false);
      navigate("/auth");
    }
    catch (error) {
      console.error("Logout failed:", error);
    }
  }
  return (
    <div className="w-full bg-[linear-gradient(180deg,#f7f8fc_0%,#f3f4f8_100%)] flex justify-center px-4 sm:px-6 pt-4">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-6xl rounded-2xl border border-white/70 bg-white/85 px-4 py-3 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-md sm:px-6 lg:px-8"
      >
        <div className="flex items-center justify-between gap-4">
          {/*Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => navigate("/")}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-slate-800 to-slate-700 text-white shadow-lg shadow-slate-900/20">
              <BsRobot size={20} />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-semibold tracking-tight text-slate-950">
                Ace.AI
              </h1>
              <p className="text-xs text-slate-500">
                Interview practice, refined
              </p>
            </div>
          </div>

          {/*Credits */}

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  setShowCreditsPopup(!showCreditsPopup);
                  setShowProfilePopup(false);
                }}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors duration-200 hover:border-slate-300 hover:bg-white sm:px-4"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-200 text-amber-700">
                  <BsCoin size={18} />
                </span>
                <span className="hidden sm:inline">Credits</span>
                {userData && (
                  <span className="rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
                    {userData.credits || 0}
                  </span>
                )}
              </motion.button>

              {/*User credits Popup*/}
              {showCreditsPopup && (
                <motion.div
                  variants={popupVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-3 w-72 rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl shadow-slate-900/10"
                >
                  <div className="mb-4 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-700 px-4 py-3 text-white">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-300">
                      Credits
                    </p>
                    <p className="mt-1 text-sm text-slate-100">
                      Keep practicing without interruptions.
                    </p>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">
                    Need more credits to continue your interview sessions?
                  </p>
                  <motion.button
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-4 w-full rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate-800"
                  >
                    Buy Credits
                  </motion.button>
                </motion.div>
              )}
            </div>

            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  setShowProfilePopup(!showProfilePopup);
                  setShowCreditsPopup(false);
                }}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-slate-950 via-slate-800 to-slate-700 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 ring-1 ring-slate-950/5"
              >
                {userData ? (
                  userData?.name.slice(0, 1).toUpperCase()
                ) : (
                  <FaUserAstronaut size={18} />
                )}
              </motion.button>

              {/*User profile Popup*/}
              {showProfilePopup && (
                <motion.div
                  variants={popupVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-3 w-72 rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl shadow-slate-900/10 z-50 flex flex-col gap-1"
                >
                  {/* User Details */}
                  <div className="mb-2 rounded-2xl bg-gradient-to-r from-slate-950 to-slate-700 p-4 text-white">
                    <p className="truncate text-sm font-semibold">
                      {userData?.name}
                    </p>
                    <p className="truncate text-xs text-slate-300">
                      {userData?.email}
                    </p>
                  </div>

                  {/* History Button */}
                  <button className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-950">
                    History
                  </button>

                  {/* Logout Button */}
                  <motion.button 
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLogout()}
                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-3 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition-all duration-150 hover:from-red-700 hover:to-red-600"
                  >
                    <HiOutlineLogout size={18} />
                    Logout
                  </motion.button>
                </motion.div>
              )}
            </div>
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
