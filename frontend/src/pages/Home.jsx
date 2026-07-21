import React, { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";


//Components
import ServicesCards from '../components/Cards.jsx';
import Navbar from "../components/navbar";
import AuthComponent from "../components/AuthComponent.jsx";
import Footer from '../components/footer.jsx'


//React Icons & Images
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";

function Home() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col ">
      <Navbar />

      <div className="flex-1 px-6 py-20 max-w-6xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full flex items-center gap-2">
            <HiSparkles size={16} className="bg-green-50 text-green-600" />
            AI Powered Smart Interview Platform
          </div>
        </div>
        <div className="text-center mb-28">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-semibold leading-tight max-w-4xl mx-auto flex flex-col"
          >
            <span>Practice Interviews with</span>

            <span className="relative inline-block">
              <span className="font-sans bg-green-100 text-green-600 px-5 py-1 rounded-full">
                Ace.AI
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-lg md:text-xl text-gray-600 mt-6 max-w-2xl mx-auto"
          >
            Prepare for your next interview with confidence using our AI-powered
            platform.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-4 mt-10 ">
            {/*Interview btn*/}
            <motion.button
              whileHover={{ opacity: 0.9, scale: 1.03 }}
              whileTap={{ opacity: 1, scale: 0.98 }}
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                navigate("/interview");
              }}
              className="bg-black text-white px-10 py-3 rounded-full shadow-md"
            >
              Start Practicing
            </motion.button>

            {/*History btn*/}
            <motion.button
              whileHover={{ opacity: 0.9, scale: 1.03 }}
              whileTap={{ opacity: 1, scale: 0.98 }}
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                navigate("/history");
              }}
              className="bg-white text-black px-10 py-3 rounded-full shadow-md"
            >
              View History
            </motion.button>
          </div>
        </div>
        
        {/**Cards */}
        <ServicesCards />
      </div>
      <Footer />
      {showAuth && <AuthComponent onClose={() => setShowAuth(false)} />}
    </div>
  );
}

export default Home;
