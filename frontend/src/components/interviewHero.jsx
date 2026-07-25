import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import mVideo from "../../public/Videos/male-ai.mp4";
import Timer from "./Timer";
import interviewService from "../services/api/InterviewService";

// React Icons
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { BsArrowRight } from "react-icons/bs";

function InterviewHero({ interviewData, onFinish }) {
  const {
    creditsRemaining,
    interviewId,
    questions = [],
    userName,
  } = interviewData || {};

  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(
    questions?.[currentIndex]?.timeLimit || 60
  );

  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subtitle, setSubtitle] = useState("");

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const currentQuestion = questions?.[currentIndex];

  // Keep refs in sync with state
  const isMicOnRef = useRef(isMicOn);
  const isAIPlayingRef = useRef(isAIPlaying);

  useEffect(() => {
    isMicOnRef.current = isMicOn;
  }, [isMicOn]);

  useEffect(() => {
    isAIPlayingRef.current = isAIPlaying;
  }, [isAIPlaying]);

  // Update timer whenever currentIndex changes
  useEffect(() => {
    if (questions?.[currentIndex]?.timeLimit) {
      setTimeLeft(questions[currentIndex].timeLimit);
    } else {
      setTimeLeft(60);
    }
  }, [currentIndex, questions]);

  // Load male voice specifically from Browser SpeechSynthesis API
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) {
        return;
      }

      const maleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male") ||
          v.name.toLowerCase().includes("george")
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        return;
      }

      // Default fallback if no explicitly named male voice is found
      setSelectedVoice(voices[0]);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const startMic = () => {
    if (recognitionRef.current && !isAIPlayingRef.current) {
      try {
        recognitionRef.current.start();
        setIsMicOn(true);
        isMicOnRef.current = true;
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Speech recognition error:", error);
        }
      }
    }
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping mic:", error);
      }
    }
    setIsMicOn(false);
    isMicOnRef.current = false;
  };

  // Speak the text with the voice
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      // Ensure microphone state is turned off when AI starts speaking
      stopMic();

      const humanSpeechFormat = text
        .replace(/,/g, " ... ")
        .replace(/\./g, " ... ");

      const utterance = new SpeechSynthesisUtterance(humanSpeechFormat);

      utterance.voice = selectedVoice;
      utterance.rate = 1;
      utterance.pitch = 0.95; // Slightly deeper pitch for a consistent male tone
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        isAIPlayingRef.current = true;
        videoRef.current?.play();
      };

      utterance.onend = () => {
        setIsAIPlaying(false);
        isAIPlayingRef.current = false;
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }

        setTimeout(() => {
          setSubtitle("");
          // Automatically turn on microphone after AI finishes speaking
          startMic();
          resolve();
        }, 300);
      };

      setSubtitle(text);
      window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    if (!selectedVoice) return;

    const runIntroduction = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hello ${userName}, it's great to meet you! Welcome to the AI Smart Interview. I hope you are confident and ready.`
        );

        await speakText(
          `I'll ask you a few questions. Just answer naturally, and take your time. Lets get started.`
        );

        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (currentIndex === questions.length - 1) {
          await speakText(
            `Alright, This is the last question. This one might be a bit more tricky. Please answer it to the best of your ability.`
          );
        }

        await speakText(currentQuestion.question);
      }
    };

    runIntroduction();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if (isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev < 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex, isSubmitting]);

  // Speech Recognition Initialization
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      if (currentTranscript.trim()) {
        setAnswer((prev) => {
          // Append spoken text cleanly to existing text
          return prev ? `${prev.trim()} ${currentTranscript.trim()}` : currentTranscript.trim();
        });
      }
    };

    recognition.onend = () => {
      // Restart mic automatically if user hasn't explicitly muted and AI isn't playing
      if (isMicOnRef.current && !isAIPlayingRef.current) {
        try {
          recognition.start();
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.error("Error restarting recognition:", error);
          }
        }
      }
    };

    recognitionRef.current = recognition;
  }, []);

  // Auto-submit answer when time reaches zero
  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    if (timeLeft <= 0 && !isSubmitting && !feedback) {
      submitAnswer();
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }

      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleMic = () => {
    if (isAIPlaying) return;

    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
  };

  const submitAnswer = async () => {
    if (isSubmitting || isAIPlaying || isAIPlayingRef.current) return;

    stopMic();
    setIsSubmitting(true);

    try {
      const formData = {
        interviewId,
        questionIndex: currentIndex,
        answer,
        timetaken: (currentQuestion?.timeLimit || 60) - timeLeft,
      };
      const response = await interviewService.submitAnswer(formData);
      console.log("Answer submitted successfully:", answer);
      setFeedback(response.data.feedback);

      speakText(response.data.feedback);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error submitting answer:", error);
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = async () => {
    stopMic();
    setFeedback("");
    setAnswer("");

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    await speakText("Great! Let's move on to the next question.");

    setCurrentIndex(currentIndex + 1);
  };

  const finishInterview = async () => {
    stopMic();

    try {
      console.log(interviewId)
      const response = await interviewService.finishInterview(interviewId);
      console.log("Interview finished successfully:", response.data);
      onFinish(response.data);
    } catch (error) {
      console.error("Error finishing interview:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[1400px] min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden">
        {/* video section */}
        <div className="w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200">
          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl">
            <video
              src={mVideo}
              ref={videoRef}
              playsInline
              preload="auto"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Subtitle */}
          <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm h-24 overflow-clip">
            <p className="text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Timer */}
          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Interview Status</span>
              <span className="text-sm font-semibold text-emerald-600">
                {isAIPlaying ? "AI is speaking..." : isMicOn ? "Listening..." : ""}
              </span>
            </div>

            <div className="h-px bg-gray-200"></div>
            <div className="flex justify-between">
              <Timer
                timeleft={timeLeft}
                totalTime={currentQuestion?.timeLimit || 60}
              />
            </div>

            <div className="grid grid-cols-2 gap-6 text-center">
              <div>
                <span className="text-2xl font-bold text-emerald-600">
                  {currentIndex + 1}
                </span>
                <span className="text-xs text-gray-400 block">Current Question</span>
              </div>

              <div>
                <span className="text-2xl font-bold text-emerald-600">
                  {questions.length}
                </span>
                <span className="text-xs text-gray-400 block">Total Questions</span>
              </div>
            </div>
          </div>
        </div>

        {/* questions section */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative">
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-600 mb-6">
            AI Smart Interview
          </h2>

          <div className="relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
            <p className="text-xs sm:text-sm text-gray-400 mb-2">
              Question {currentIndex + 1} of {questions?.length || 0}
            </p>

            <div className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed ">
              {currentQuestion?.question}
            </div>
          </div>

          <textarea
            placeholder="Type or speak your answer here..."
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
            }}
            className="flex-1 bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition text-gray-800"
          />

          {!feedback ? (
            <div className="flex items-center gap-4 mt-6">
              <motion.button
                onClick={toggleMic}
                disabled={isAIPlaying}
                whileTap={{ scale: 0.9 }}
                className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full text-white shadow-lg transition-colors ${
                  isAIPlaying
                    ? "bg-gray-400 cursor-not-allowed"
                    : isMicOn
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-red-500 hover:bg-red-600"
                }`}
                title={
                  isAIPlaying
                    ? "Microphone disabled while AI is speaking"
                    : isMicOn
                    ? "Turn Microphone Off"
                    : "Turn Microphone On"
                }
              >
                {isMicOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
              </motion.button>

              <motion.button
                onClick={submitAnswer}
                disabled={isSubmitting || isAIPlaying}
                whileTap={{ scale: 0.9 }}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Submitting..."
                  : isAIPlaying
                  ? "AI is speaking..."
                  : "Submit Answer"}
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm"
            >
              <p className="text-emerald-700 font-medium mb-4">{feedback}</p>

              <button
                onClick={handleNextQuestion}
                disabled={isAIPlaying}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-1 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Next Question <BsArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InterviewHero;