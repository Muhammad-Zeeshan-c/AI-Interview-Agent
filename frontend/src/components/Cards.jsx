import React from "react";
import { motion } from "framer-motion";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText,
} from "react-icons/bs";

// Images in /public directory referenced by public URL path
const hrImg = "/HR.png";
const techImg = "/tech.png";
const confidenceImg = "/confi.png";
const creditImg = "/credit.png";
const evalImg = "/ai-ans.png";
const resumeImg = "/resume.png";
const pdfImg = "/pdf.png";
const analyticsImg = "/history.png";

function ServicesCards() {
  const cards = [
    {
      icon: <BsRobot size={24} />,
      step: "STEP 1",
      title: "Role & Experience Selection",
      desc: "AI adjusts difficulty based on selected job role.",
    },
    {
      icon: <BsMic size={24} />,
      step: "STEP 2",
      title: "Smart Voice Interview",
      desc: "Dynamic follow-up questions based on your answers.",
    },
    {
      icon: <BsClock size={24} />,
      step: "STEP 3",
      title: "Timer Based Simulation",
      desc: "Real interview pressure with time tracking.",
    },
  ];

  const capabilities = [
    {
      image: evalImg,
      icon: <BsBarChart size={20} />,
      title: "AI Answer Evaluation",
      desc: "Scores communication, technical accuracy and confidence.",
    },
    {
      image: resumeImg,
      icon: <BsFileEarmarkText size={20} />,
      title: "Resume Based Interview",
      desc: "Project-specific questions based on uploaded resume.",
    },
    {
      image: pdfImg,
      icon: <BsFileEarmarkText size={20} />,
      title: "Downloadable PDF Report",
      desc: "Detailed strengths, weaknesses and improvement insights.",
    },
    {
      image: analyticsImg,
      icon: <BsBarChart size={20} />,
      title: "History & Analytics",
      desc: "Track progress with performance graphs and topic analysis.",
    },
  ];

  const modes = [
    {
      image: hrImg,
      title: "HR Interview Mode",
      desc: "Behavioral and technical questions for HR interviews.",
    },
    {
      image: techImg,
      title: "Technical Interview Mode",
      desc: "Project-specific technical questions for tech interviews.",
    },
    {
      image: confidenceImg,
      title: "Confidence Evaluation",
      desc: "Basic tone and voice analysis insights.",
    },
    {
      image: creditImg,
      title: "Credits System",
      desc: "Unlock premium interview sessions.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* STEPS SECTION */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-28">
        {cards.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 + index * 0.2 }}
            whileHover={{ rotate: 0, scale: 1.06 }}
            className={`
              relative bg-white rounded-3xl border-2 border-green-100
              hover:border-green-500 p-10 w-80 max-w-[90%] shadow-md
              hover:shadow-2xl transition-all duration-300
              ${index === 0 ? "rotate-[-4deg]" : ""}
              ${index === 1 ? "rotate-3 md:-mt-6 shadow-xl" : ""}
              ${index === 2 ? "rotate-3" : ""}
            `}
          >
            <div className="text-green-600 mb-4">{item.icon}</div>
            <span className="text-xs font-semibold text-gray-400 tracking-wider">
              {item.step}
            </span>
            <h3 className="text-xl font-bold text-gray-800 mt-1 mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* CAPABILITIES SECTION */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-semibold text-center mb-16"
      >
        Multiple Interview <span className="text-green-600">Capabilities</span>
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-10 mb-28">
        {capabilities.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2 flex justify-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-auto object-contain max-h-64"
                />
              </div>

              <div className="w-full md:w-1/2">
                {item.icon && (
                  <div className="bg-green-50 text-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                    {item.icon}
                  </div>
                )}
                <h3 className="font-semibold mb-2 text-xl">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODES SECTION */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-semibold text-center mb-16"
      >
        Interview Modes & <span className="text-green-600">Features</span>
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-8">
        {modes.map((mode, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -6 }}
            className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="w-1/2">
                <h3 className="font-semibold text-xl mb-3">
                  {mode.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {mode.desc}
                </p>
              </div>

              {/* RIGHT IMAGE */}
              <div className="w-1/2 flex justify-end">
                <img
                  src={mode.image}
                  alt={mode.title}
                  className="w-28 h-28 object-contain"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default ServicesCards;