import express from 'express';
import { getChatbotResponse } from '../controllers/chatbotController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: "Chatbot API is working" });
});

router.post('/message', getChatbotResponse);

export default router;