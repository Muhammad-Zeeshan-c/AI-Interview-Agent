import React, { useState } from "react";
import InterviewSetup from "../components/interviewSetup.jsx";
import InterviewHero from "../components/interviewHero";
import InterviewReport from "../components/interviewReport";



function Interview() {
  const [step, setStep] = useState(1);
  const [interviewData, setInterviewData] = useState(null);
  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {step === 1 && (
          <InterviewSetup
            onStart={(data) => {
              setInterviewData(data);
              setStep(2);
            }}
          />
        )}

        {step === 2 && <InterviewHero interviewData={interviewData} 
        onFinish={(report) => {
            setInterviewData(report);
            SetStep(3);
        }} />}

        {step === 3 && <InterviewReport report={interviewData} />}
      </div>
    </>
  );
}

export default Interview;
