const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.mjs');
const User = require('../models/userModel');
const { InterviewModel } = require('../models/interviewModel');
const { askAi } = require('../services/openRouterService.js');


const analyzeResume = async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Resume file is required' });
    }

    filePath = req.file.path;
    

    const filebuffer = await fs.promises.readFile(filePath);
    const fileContent = new Uint8Array(filebuffer);

    const pdf = await pdfjsLib.getDocument({ data: fileContent }).promise;
    console.log(`PDF loaded with ${pdf.numPages} page(s).`);

    let resumetext = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(' ');
      resumetext += pageText + ' ';
    }

    resumetext = resumetext.replace(/\s+/g, ' ').trim();

    const prompt = [
      {
        role: 'system',
        content: `You are an expert resume parser. Extract candidate details from the provided resume text.
Return ONLY a raw JSON object with no Markdown formatting or backticks:
{
  "role": "extracted primary role or job title",
  "experience": "years or description of experience",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}`,
      },
      {
        role: 'user',
        content: `Resume Content:\n${resumetext}`,
      },
    ];

    const responseText = await askAi(prompt);

    let parsedResponse = {};
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', responseText);
      throw new Error('AI response was not in expected JSON format.');
    }

    // Clean up file safely
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }

    return res.status(200).json({
      role: parsedResponse.role || '',
      experience: parsedResponse.experience || '',
      projects: parsedResponse.projects || [],
      skills: parsedResponse.skills || [],
      resumeText: resumetext,
    });
  } catch (err) {
    console.error('Error analyzing resume:', err);

    // Clean up temporary file on failure
    if (filePath && fs.existsSync(filePath)) {
      try {
        await fs.promises.unlink(filePath);
      } catch (cleanupErr) {
        console.error('Failed to clean up file:', cleanupErr);
      }
    }

    return res.status(500).json({
      message: `Error analyzing resume: ${err.message}`,
    });
  }
};

const generateQuestions = async (req, res) => {
  try {
    const { role, experience, mode, resumeText, projects, skills } = req.body;
    console.log(role, experience, mode, resumeText, projects, skills);
    if (!role?.trim() || !experience?.trim() || !mode?.trim()) {
      return res
        .status(400)
        .json({ error: 'Role, experience, and mode are required fields.' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Usere details  ..........\n', user);
    if (user.credits < 50) {
      return res.status(403).json({ error: 'Insufficient credits.' });
    }

    const projectText = Array.isArray(projects) ? projects.join(' ') : projects || '';
    const skillText = Array.isArray(skills) ? skills.join(' ') : skills || '';
    const cleanedResumeText = resumeText ? resumeText.trim() : '';

    const userPrompt = `
      Role: ${role}
      Experience: ${experience}
      Mode: ${mode}
      Resume Text: ${cleanedResumeText}
      Projects: ${projectText}
      Skills: ${skillText}
    `;

    const messages = [
      {
        role: 'system',
        content: `You are an expert technical interviewer. Your task is to generate exactly 5 interview questions tailored to the candidate's profile.

    CRITICAL OUTPUT REQUIREMENTS:
    1. Return ONLY a valid, raw JSON object. Do NOT wrap output in markdown fences (no \`\`\`json).
    2. The JSON must follow this exact schema:
    {
      "questions": [
        "Question 1 text here",
        "Question 2 text here",
        "Question 3 text here",
        "Question 4 text here",
        "Question 5 text here"
      ]
    }

    STRICT QUESTION RULES:
    - Exactly 5 questions total in the array.
    - Each question must be a single sentence under 20 words.
    - No sub-questions, bullet points, numbers, or multi-part questions.
    - Simple, realistic, and conversational language.

    DIFFICULTY PROGRESSION:
    - Question 1: Medium difficulty (practical application).
    - Questions 2-4: Hard difficulty (core concepts, problem-solving, critical thinking).
    - Question 5: Complex difficulty (challenging real-world scenario).`,
      },
      {
        role: 'user',
        content: `Candidate Profile:\n${userPrompt}`,
      },
    ];

    const rawResponse = await askAi(messages);
    if (!rawResponse) {
      return res.status(500).json({ message: 'Failed to generate questions.' });
    }

    let parsedData = {};
    try {
      parsedData = JSON.parse(rawResponse);
    } catch (parseErr) {
      console.error('Failed to parse AI response:', rawResponse);
      return res.status(500).json({ message: 'Invalid JSON response from AI.' });
    }

    console.log('Parsed Data from AI: ------------------------ \n', parsedData);
    const questionsList = parsedData.questions;
    console.log('Questions List: ------------------------ \n', questionsList);
    if (!Array.isArray(questionsList) || questionsList.length === 0) {
      return res.status(500).json({ message: 'Failed to parse questions array.' });
    }

    const difficulties = ['medium', 'hard', 'hard', 'hard', 'complex'];
    const timeLimits = [90, 120, 120, 120, 180];

    const formattedQuestions = questionsList.slice(0, 5).map((qText, index) => ({
      question: qText,
      difficulty: difficulties[index] || 'medium',
      timeLimit: timeLimits[index] || 120,
    }));

    user.credits -= 50;
    await user.save();
    console.log('------------------', mode);
    const interviewModel = new InterviewModel({
      userId: user._id,
      role: role,
      experience: experience,
      mode: mode,
      resumeText: cleanedResumeText,
      questions: formattedQuestions,
    });

    await interviewModel.save();

    return res.status(200).json({
      interviewId: interviewModel._id,
      creditsRemaining: user.credits || '',
      userName: user.name,
      questions: interviewModel.questions,
    });
  } catch (error) {
    console.error('Error occurred while generating questions:', error);
    return res.status(500).json({ error: 'Failed to generate questions.' });
  }
};

const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken } = req.body;

    const interview = await InterviewModel.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const question = interview.questions[questionIndex];
    if (!question) {
      return res.status(400).json({ message: 'Invalid question index' });
    }

    if (!answer || !answer.trim()) {
      question.score = 0;
      question.confidence = 0;
      question.communication = 0;
      question.correctness = 0;
      question.feedback = 'No answer provided.';
      question.answer = '';

      await interview.save();
      return res.status(200).json({ feedback: question.feedback });
    }

    if (timeTaken > question.timeLimit) {
      question.score = 0;
      question.confidence = 0;
      question.communication = 0;
      question.correctness = 0;
      question.feedback = 'Time limit exceeded.';
      question.answer = answer;

      await interview.save();
      return res.status(200).json({ feedback: question.feedback });
    }

    const messages = [
      {
        role: 'system',
        content: `You are a professional Human interviewer evaluating a candidate's answer in an interview.

Evaluate naturally and fairly like an interviewer based on the candidate's answer.

Score answer in these areas (0 to 10):
1. Confidence - Does the user sound clear, confident, etc.
2. Communication - Is the language simple, clear, and easy to understand.
3. Correctness - Is the user accurate, relevant, etc.

Rules:
- Be realistic and unbiased.
- Do not give random scores.
- If the answer is weak/unclear, give a lower score and vice versa.
- Consider clarity, structure, and relevance.

Calculate:
finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

Feedback Rules:
- Write natural human feedback.
- 10 to 15 words only.
- Sound like real interview feedback.
- Can suggest improvement if needed.
- Do NOT repeat the question.
- Do NOT explain scoring.
- Keep tone professional and honest.

Return ONLY valid JSON in this format:
{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "short human feedback"
}`,
      },
      {
        role: 'user',
        content: `Question: ${question.question}\nAnswer: ${answer}`,
      },
    ];

    const response = await askAi(messages);
    const parsedResponse = JSON.parse(response);

    question.answer = answer;
    question.confidence = parsedResponse.confidence || 0;
    question.communication = parsedResponse.communication || 0;
    question.correctness = parsedResponse.correctness || 0;
    question.score = parsedResponse.finalScore || 0;
    question.feedback = parsedResponse.feedback || 'Good attempt.';

    await interview.save();

    return res.status(200).json({ feedback: question.feedback });
  } catch (error) {
    console.error('Error in submitAnswer:', error);
    return res.status(500).json({ message: `Failed to submit answer: ${error.message || error}` });
  }
};

const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;
    const interview = await InterviewModel.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
    const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;
    const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

    interview.finalScore = Number(finalScore.toFixed(2));
    interview.status = 'completed';
    await interview.save();

    return res.status(200).json({
      finalScore: Number(finalScore.toFixed(2)),
      confidence: Number(avgConfidence.toFixed(2)),
      correctness: Number(avgCorrectness.toFixed(2)),
      communication: Number(avgCommunication.toFixed(2)),
      questionWiseScore: interview.questions.map((q) => ({
        question: q.question || '',
        score: q.score || 0,
        feedback: q.feedback || '',
        confidence: q.confidence || 0,
        communication: q.communication || 0,
        correctness: q.correctness || 0,
      })),
    });
  } catch (error) {
    console.error('Error in finishInterview:', error);
    return res.status(500).json({ message: `Failed to finish interview: ${error.message || error}` });
  }
};

const getInterviews = async (req, res) => {
  try{
    const interviewDetails=await InterviewModel.find({userId:req.userId}).sort({createdAt:-1}).select('role experince mode resumeText finalScore status createdAt');
    
    return res.status(200).json({ interviewDetails });
  }
  catch(error){
    console.error('Error in getInterviewDetails:', error);
    return res.status(500).json({ message: `Failed to get interview details: ${error.message || error}` });
  }
}

const getInterviewReport=async (req,res)=>{
  try{
    const interview=await InterviewModel.findOne({userId:req.userId})
    if(!interview){
      return res.status(404).json({ message: 'Interview not found' });
    }

    const totalQuestions = interview.questions.length;


    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {

      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });


    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
    const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;
    const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

    return res.json({
      finalScore: interview.finalScore,
      confidence: Number(avgConfidence.toFixed(2)),
      correctness: Number(avgCorrectness.toFixed(2)),
      communication: Number(avgCommunication.toFixed(2)),
      questionWiseScore: interview.questions
    })

  }
  catch(error){
    console.error('Error in getInterviewReport:', error);
    return res.status(500).json({ message: `Failed to get interview report: ${error.message || error}` });
  }
}
module.exports = { analyzeResume, generateQuestions, submitAnswer, finishInterview,getInterviews,getInterviewReport};