import React from 'react';
import {
  ShoppingCart, Search, X, Utensils, Cake, Wine, Cigarette,
  Square, Grid3X3, List
} from 'lucide-react';

const PRIMARY_BLUE = '#3673B4';

const Header = ({
  activeSection,
  handleSectionClick,
  searchQuery,
  setSearchQuery,
  cardSize,
  setCardSize,
  sectionCategories,
  activeCategory,
  setActiveCategory,
  setShowRightSidebar,
  isMobile
}) => {
  const getGridClasses = () => {
    if (cardSize === 'large') return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5';
    if (cardSize === 'small') return 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3';
    return 'space-y-3';
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-3 py-2.5 md:px-6 md:py-3">
        <div className="flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4 lg:gap-6">
            {[
              { section: 'dine-in', icon: Utensils },
              { section: 'desserts', icon: Cake },
              { section: 'drinks', icon: Wine },
              { section: 'smoking', icon: Cigarette }
            ].map(({ section, icon: Icon }) => (
              <button
                key={section}
                onClick={() => handleSectionClick(section)}
                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeSection === section ? 'bg-blue-50' : ''}`}>
                  <Icon
                    className="w-5 h-5"
                    style={{ color: activeSection === section ? PRIMARY_BLUE : '#6B7280' }}
                  />
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowRightSidebar(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </button>
        </div>
      </header>

      {activeSection !== 'reservations' && (
        <div className="bg-white border-b border-gray-200 px-3 py-3 md:px-6 md:py-4">
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                  >
                    <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setCardSize('large')}
                  className={`p-1.5 rounded ${cardSize === 'large' ? 'bg-white shadow-sm' : ''}`}
                  title="Large"
                >
                  <Square className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCardSize('small')}
                  className={`p-1.5 rounded ${cardSize === 'small' ? 'bg-white shadow-sm' : ''}`}
                  title="Small"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCardSize('list')}
                  className={`p-1.5 rounded ${cardSize === 'list' ? 'bg-white shadow-sm' : ''}`}
                  title="List"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {sectionCategories[activeSection].map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${activeCategory === category
                      ? 'bg-blue-700 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;