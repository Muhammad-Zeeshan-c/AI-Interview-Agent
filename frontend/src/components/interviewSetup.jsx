import React, { useState } from "react";
import { motion } from "framer-motion";
import {useSelector,useDispatch} from 'react-redux';
import {setUserData} from '../redux/userSlice/userSlice'

import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine,
} from "react-icons/fa";

import interviewService from "../services/api/InterviewService";

function InterviewSetup({ onStart }) {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("technical");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resume, setResume] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [analysisCompleted, setAnalysisCompleted] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const interviewSteps = [
    {
      icon: <FaUserTie className="text-green-600 text-xl" />,
      text: "Choose Role & Experience",
    },
    {
      icon: <FaMicrophoneAlt className="text-green-600 text-xl" />,
      text: "Smart Voice Interview",
    },
    {
      icon: <FaChartLine className="text-green-600 text-xl" />,
      text: "Performance Analytics",
    },
  ];

  const dispatch=useDispatch()
  const userData=useSelector((state)=>state.user.userData)
  const handleResumeUpload = async (e) => {
    if (!resume || analyzing) {
      console.log('1')
      return
    };

    try {
      setAnalyzing(true);

      const data = await interviewService.analyzeResume(resume);
      setRole(data.role || "");
      setExperience(data.experience || "");
      setSkills(data.skills || []);
      setProjects(data.projects || []);
      setResumeText(data.resumeText || "");
      setAnalysisCompleted(true);
    } catch (error) {
      console.error("Error uploading/analyzing resume:", error);
      alert(error.response?.data?.message || "Failed to analyze resume.");
    } finally {
      setAnalyzing(false);
    }
  };

  const generateQuestions=async()=>{
    setLoading(true);
    try{
      const formData = {
        role,
        experience,
        mode,
        projects,
        skills,
        resumeText,
      };
      const response = await interviewService.generateInterviewQuestions(formData);
      console.log("Generated Questions:", response);
      console.log('Response data: ------------------------ \n', response);
      if(userData){
        dispatch(setUserData({ ...userData, credits: response.creditsRemaining}));
      }

      setLoading(false);
      onStart(response.data);
    }
    catch(error){
      console.error(error)
      setLoading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 px-4"
    >
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden">
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative bg-linear-to-br from-green-50 to-green-100 p-12 flex flex-col justify-center"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Start Your Interview
          </h2>
          <p className="text-gray-600 mb-8">
            Practice interview scenarios powered by AI. Improve your skills and
            gain confidence with our interactive platform.
          </p>

          {interviewSteps.map((item, index) => (
            <motion.div
              key={index}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + index * 0.15 }}
              whileHover={{ scale: 1.03 }}
              className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm cursor-pointer mb-4"
            >
              {item.icon}
              <span className="text-gray-700 font-medium">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="p-12 bg-white"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Interview SetUp
          </h2>

          <div className="space-y-6">
            {/*Role*/}
            <div className="relative">
              <FaUserTie className="absolute top-4 left-4 text-gray-400" />

              <input
                type="text"
                placeholder="Enter role"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                onChange={(e) => setRole(e.target.value)}
                value={role}
              />
            </div>
            {/*Experience*/}
            <div className="relative">
              <FaBriefcase className="absolute top-4 left-4 text-gray-400" />

              <input
                type="text"
                placeholder="Enter experience"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
              />
            </div>

            {/*Select Mode:*/}
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
            >
              <option value="technical">Technical Interview</option>
              <option value="hr">HR Interview</option>
            </select>

            {!analysisCompleted && (
              <motion.div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition">
                <label htmlFor="resumeUpload" className="cursor-pointer block">
                  <FaFileUpload className="text-4xl mx-auto text-green-600 mb-3" />

                  <input
                    type="file"
                    accept="application/pdf"
                    id="resumeUpload"
                    className="hidden"
                    onChange={(e) => setResume(e.target.files[0])}
                  />

                  <p className="text-gray-600 font-medium">
                    {resume ? resume.name : "Click to upload resume"}
                  </p>

                  {resume && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 bg-green-600 text-white py-2 px-4 rounded-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleResumeUpload();
                      }}
                    >
                      {analyzing ? "Analyzing..." : "Analyze Resume"}
                    </motion.button>
                  )}
                </label>
              </motion.div>
            )}

            <motion.button
              disabled={!role || !experience}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}

              onClick={()=>{generateQuestions()}}
              className="w-full disabled:bg-gray-600 bg-green-600 hover:bg-green-700 text-white py-3 rounded-full text-lg font-semibold transition duration-300 shadow-md"
            >
              {loading ? "Generating Questions..." : "Start Interview"}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default InterviewSetup;
