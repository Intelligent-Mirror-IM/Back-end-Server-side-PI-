import User from '../models/schemas/userSchema.js';

export const getChatbotResponse = async (req, res) => {
  try {
    // Logic to process chatbot request
    const userInput = req.body.input;
    // Here you would typically call a service or model to get a response based on userInput
    const response = `You said: ${userInput}`; // Placeholder response

    res.status(200).json({ message: response });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
};

export const saveUserData = async (req, res) => {
  try {
    const userData = new User(req.body);
    await userData.save();
    res.status(201).json({ message: 'User data saved successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while saving user data.' });
  }
};