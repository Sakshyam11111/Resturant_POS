import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, ChefHat, Clock, TrendingUp, Star } from 'lucide-react';

const AIRecommendation = ({ currentOrderItems, onAddRecommendation }) => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ai');

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentOrderItems }),
      });
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentOrderItems && currentOrderItems.length > 0) {
      fetchRecommendations();
    }
  }, [currentOrderItems]);

  const tabs = [
    { id: 'ai', label: 'AI Picks', icon: Sparkles },
    { id: 'ingredients', label: 'Based on Order', icon: ChefHat },
    { id: 'complementary', label: 'Goes Well With', icon: Brain },
    { id: 'popular', label: 'Popular', icon: TrendingUp },
  ];

  const getRecommendationsForTab = () => {
    if (!recommendations) return [];
    
    switch (activeTab) {
      case 'ai': return recommendations.aiSuggestions || [];
      case 'ingredients': return recommendations.basedOnIngredients || [];
      case 'complementary': return recommendations.complementaryItems || [];
      case 'popular': return recommendations.popularItems || [];
      default: return [];
    }
  };

  if (!currentOrderItems || currentOrderItems.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 text-center">
        <Brain className="w-12 h-12 mx-auto text-blue-400 mb-3" />
        <h3 className="font-semibold text-gray-700 mb-2">AI Recommendations</h3>
        <p className="text-sm text-gray-500">Add items to your order to get personalized recommendations</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-white" />
            <h3 className="font-semibold text-white">AI Recommendations</h3>
          </div>
          <button
            onClick={fetchRecommendations}
            className="text-sm text-blue-100 hover:text-white transition-colors"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-3 text-sm font-medium transition-colors ${activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              <div className="flex items-center justify-center gap-1">
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Recommendations */}
      <div className="p-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-500 mt-2">AI is thinking...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {getRecommendationsForTab().map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50 transition-colors border border-gray-100"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{item.name}</span>
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                    {item.description || `Made with ${item.ingredients.slice(0, 3).join(', ')}`}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.timeConsumed} mins</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>Rs. {item.price.toLocaleString()}</span>
                    </div>
                    {item.reason && (
                      <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {item.reason}
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onAddRecommendation(item)}
                  className="ml-4 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
            ))}

            {getRecommendationsForTab().length === 0 && (
              <div className="text-center py-6 text-gray-400">
                <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recommendations available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendation;