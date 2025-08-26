const AIService = require('../services/AI.service');
const formatResponse = require('../utils/formatResponse');

class AIController {
  static async generateText(req, res) {
    try {
      const { prompt } = req.body;

      if (!prompt) {
        return res
          .status(400)
          .json(formatResponse(400, 'Prompt is required', null, 'Prompt is required'));
      }

      const response = await AIService.generateResponse(prompt);

      return res
        .status(200)
        .json(formatResponse(200, 'AI response generated successfully', response));
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, error.message));
    }
  }
}

module.exports = AIController;
