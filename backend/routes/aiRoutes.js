// routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const AIRecommendationEngine = require('../aiRecommendation');

const aiEngine = new AIRecommendationEngine();

// Get AI recommendations
router.post('/recommendations', async (req, res) => {
  try {
    const { currentOrderItems } = req.body;
    
    const recommendations = {
      basedOnIngredients: aiEngine.recommendByIngredients(currentOrderItems, 3),
      complementaryItems: aiEngine.recommendComplements(currentOrderItems, 2),
      popularItems: aiEngine.getPopularItems(2),
      aiSuggestions: aiEngine.getAISuggestions(currentOrderItems)
    };

    res.json(recommendations);
  } catch (error) {
    console.error('AI recommendation error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// Search menu items
router.get('/search', async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;
    const results = aiEngine.searchMenuItems(query, parseInt(limit));
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get similar items
router.get('/similar/:itemName', async (req, res) => {
  try {
    const { itemName } = req.params;
    const { limit = 5 } = req.query;
    const similarItems = aiEngine.findSimilarItems(itemName, parseInt(limit));
    res.json(similarItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to find similar items' });
  }
});

module.exports = router;