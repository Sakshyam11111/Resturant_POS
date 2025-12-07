// backend/routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const AIRecommendationEngine = require('../aiRecommendation');

// Initialize AI engine
const aiEngine = new AIRecommendationEngine();

// Load CSV data on startup
const csvPath = path.join(__dirname, '../data/restaurant_menu.csv');
aiEngine.loadMenuData(csvPath)
  .then(() => {
    console.log('✅ AI Recommendation Engine initialized with CSV data');
  })
  .catch((error) => {
    console.error('❌ Failed to initialize AI Engine:', error);
  });

// Middleware to check if engine is loaded
const checkEngineLoaded = (req, res, next) => {
  if (!aiEngine.isLoaded) {
    return res.status(503).json({ 
      error: 'AI Engine is still loading. Please try again in a moment.' 
    });
  }
  next();
};

// Get AI recommendations
router.post('/recommendations', checkEngineLoaded, async (req, res) => {
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
router.get('/search', checkEngineLoaded, async (req, res) => {
  try {
    const { query, limit = 10 } = req.query;
    const results = aiEngine.searchMenuItems(query, parseInt(limit));
    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get similar items
router.get('/similar/:itemName', checkEngineLoaded, async (req, res) => {
  try {
    const { itemName } = req.params;
    const { limit = 5 } = req.query;
    const similarItems = aiEngine.findSimilarItems(itemName, parseInt(limit));
    res.json(similarItems);
  } catch (error) {
    console.error('Similar items error:', error);
    res.status(500).json({ error: 'Failed to find similar items' });
  }
});

// Get all menu items (for debugging)
router.get('/menu', checkEngineLoaded, async (req, res) => {
  try {
    res.json({
      success: true,
      count: aiEngine.menuItems.length,
      items: aiEngine.menuItems
    });
  } catch (error) {
    console.error('Menu fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch menu' });
  }
});

// Reload CSV data (for development)
router.post('/reload', async (req, res) => {
  try {
    await aiEngine.loadMenuData(csvPath);
    res.json({ 
      success: true, 
      message: 'CSV data reloaded successfully',
      itemCount: aiEngine.menuItems.length
    });
  } catch (error) {
    console.error('Reload error:', error);
    res.status(500).json({ error: 'Failed to reload CSV data' });
  }
});

module.exports = router;