// controllers/submission.controller.js
import Quiz from "../model/Quiz.model.js";
import User from "../model/User.model.js";
import { sendResultEmail } from "../utils/mailer.utils.js";
import Submission from "../model/Submission.model.js";
import { getHistoryService } from "../services/submission.services.js";
import { generateAISuggestions,evaluateWithAI } from "../services/ai.services.js";
import mongoose from "mongoose";

// For both when submit or retry
export const submitQuiz = async (req, res) => {
  try {
    const { quizId, responses =[]} = req.body;
    const userId = req.user.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const { evaluatedResponses, score } = await evaluateWithAI(quiz, responses);
    
    const aiSuggestions = await generateAISuggestions(quiz, evaluatedResponses);

    const submission = new Submission({
      quiz: quiz._id,
      user: userId,
      responses: evaluatedResponses,
      score,
      maxScore: quiz.maxScore,
      suggestions: aiSuggestions
    });

    await submission.save();

    const user = await User.findById(userId);
    await sendResultEmail(
      user.email,
      user.username,
      quiz.title,
      score,
      quiz.totalQuestions
    );


    res.json({
      message: "Submission saved",
      submission
    });
  } catch (err) {
    res.status(500).json({ message: "Error submitting quiz", error: err.message });
  }
};

export const getHistory = async (req, res) => {
  try {
    
    const submissions = await getHistoryService(req.query, req.user.id);

    res.status(200).json({ success: true, submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const oldSubmissions = async (req, res) => {
  try {
    let { quizId, userId } = req.query;

    if (!quizId || !userId) {
      return res.status(400).json({ message: "quizId and userId are required" });
    }

    quizId = quizId.trim();
    userId = userId.trim();

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(quizId)) {
      return res.status(400).json({ message: "Invalid ObjectId format" });
    }

    
    const submissions = await Submission.find({
      user: userId,
      quiz: quizId,
    });

    if (!submissions.length) {
      return res.status(404).json({ message: "No submissions found" });
    }

    res.status(200).json({ success: true, submissions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
