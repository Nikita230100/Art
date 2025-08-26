const axios = require('axios');
const oAuth = require('../utils/gigachatAuth');

class AIService {
  static async generateResponse(prompt) {
    try {
      const { access_token } = await oAuth();

      const response = await axios.post(
        process.env.AI_URL,
        {
          model: 'GigaChat',
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      throw new Error(`AI service error: ${error.message}`);
    }
  }
}

module.exports = AIService;
