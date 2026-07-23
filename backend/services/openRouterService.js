const axios = require("axios");
const User = require("../models/userModel");
const {InterviewModel} = require("../models/interviewModel");

const api = axios.create({
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    "HTTP-Referer": process.env.SITE_URL || "",
    "X-OpenRouter-Title": process.env.SITE_NAME || "",
  },
});

const askAi = async (message) => {
  try {
    if (!message || !Array.isArray(message) || message.length === 0) {
      throw new Error("Invalid prompt");
    }
    const response = await api.post(
      "/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: message,
        response_format: { type: "json_object" },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

    let content = response?.data?.choices?.[0]?.message?.content;

    if (!content || content.trim().length === 0) {
      throw new Error("Invalid response");
    }
    content = content.replace(/```json\n?|\n?```/g, "").trim();
    return content;
  } catch (error) {
    console.error(  
      "Error occurred while asking AI:",
      error.response?.data || error.message || error
    );
    throw new Error("Failed to get a valid response from the AI service.");
  }
};

const generateQuestions = async (req, res) => {
  try {
    const { role, experience, mode, resumeText, projects, skills } = req.body;
    console.log(role,experience,mode,resumeText,projects,skills)
    if (!role?.trim() || !experience?.trim() || !mode?.trim()) {
      return res
        .status(400)
        .json({ error: "Role, experience, and mode are required fields." });
    }
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }


    console.log('Usere details  ..........\n',user)
    if (user.credits < 50) {
      return res.status(403).json({ error: "Insufficient credits." });
    }

    const projectText = Array.isArray(projects) ? projects.join(" ") : projects || "";
    const skillText = Array.isArray(skills) ? skills.join(" ") : skills || "";
    const cleanedResumeText = resumeText ? resumeText.trim() : "";

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
        role: "system",
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
        role: "user",
        content: `Candidate Profile:\n${userPrompt}`,
      },
    ];

    const rawResponse = await askAi(messages);
    if (!rawResponse) {
      return res.status(500).json({ message: "Failed to generate questions." });
    }

    let parsedData = {};
    try {
      parsedData = JSON.parse(rawResponse);
    } catch (parseErr) {
      console.error("Failed to parse AI response:", rawResponse);
      return res.status(500).json({ message: "Invalid JSON response from AI." });
    }
    console.log('Parsed Data from AI: ------------------------ \n', parsedData);
    const questionsList = parsedData.questions;
    console.log('Questions List: ------------------------ \n', questionsList);
    if (!Array.isArray(questionsList) || questionsList.length === 0) {
      return res.status(500).json({ message: "Failed to parse questions array." });
    }

    const difficulties = ["medium", "hard", "hard", "hard", "complex"];
    const timeLimits = [90, 120, 120, 120, 180];

    const formattedQuestions = questionsList.slice(0, 5).map((qText, index) => ({
      question: qText,
      difficulty: difficulties[index] || "medium",
      timeLimit: timeLimits[index] || 120,
    }));


    user.credits -= 50;
    await user.save();
    console.log('------------------',mode);
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
    console.error("Error occurred while generating questions:", error);
    return res.status(500).json({ error: "Failed to generate questions." });
  }
};

const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken } = req.body;

    const interview = await InterviewModel.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const question = interview.questions[questionIndex];
    if (!question) {
      return res.status(400).json({ message: "Invalid question index" });
    }

    // Edge Case 1: Empty or missing answer
    if (!answer || !answer.trim()) {
      question.score = 0;
      question.confidence = 0;
      question.communication = 0;
      question.correctness = 0;
      question.feedback = "No answer provided.";
      question.answer = "";

      await interview.save();
      return res.status(200).json({ feedback: question.feedback });
    }

    // Edge Case 2: Time limit exceeded
    if (timeTaken > question.timeLimit) {
      question.score = 0;
      question.confidence = 0;
      question.communication = 0;
      question.correctness = 0;
      question.feedback = "Time limit exceeded.";
      question.answer = answer;

      await interview.save();
      return res.status(200).json({ feedback: question.feedback });
    }

    // Evaluate answer with AI
    const messages = [
      {
        role: "system",
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
        role: "user",
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
    question.feedback = parsedResponse.feedback || "Good attempt.";

    await interview.save();

    return res.status(200).json({ feedback: question.feedback });
  } catch (error) {
    console.error("Error in submitAnswer:", error);
    return res.status(500).json({ message: `Failed to submit answer: ${error.message || error}` });
  }
};

const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;
    const interview = await InterviewModel.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
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
    interview.status = "completed";
    await interview.save();

    return res.status(200).json({
      finalScore: Number(finalScore.toFixed(2)),
      confidence: Number(avgConfidence.toFixed(2)),
      correctness: Number(avgCorrectness.toFixed(2)),
      communication: Number(avgCommunication.toFixed(2)),
      questionWiseScore: interview.questions.map((q) => ({
        question: q.question || "",
        score: q.score || 0,
        feedback: q.feedback || "",
        confidence: q.confidence || 0,
        communication: q.communication || 0,
        correctness: q.correctness || 0,
      })),
    });
  } catch (error) {
    console.error("Error in finishInterview:", error);
    return res.status(500).json({ message: `Failed to finish interview: ${error.message || error}` });
  }
};

module.exports = { askAi, submitAnswer, finishInterview, generateQuestions };