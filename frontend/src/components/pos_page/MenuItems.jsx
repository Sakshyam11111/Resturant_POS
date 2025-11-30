import React from 'react';
import { Search } from 'lucide-react';

const MenuItems = ({ filteredItems, cardSize, addToOrder }) => {
  const getGridClasses = () => {
    if (cardSize === 'large') return 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5';
    if (cardSize === 'small') return 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3';
    return 'space-y-3';
  };

  if (!filteredItems.length) {
    return (
      <div className="text-center py-16 text-gray-400">
        <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p className="text-sm sm:text-base">No items found</p>
      </div>
    );
  }

  if (cardSize === 'list') {
    return (
      <div className="space-y-3 max-w-5xl mx-auto">
        {filteredItems.map(item => (
          <div
            key={item.id}
            onClick={() => addToOrder(item)}
            className="bg-white rounded-lg p-3 sm:p-4 flex items-center gap-3 sm:gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">{item.name}</h3>
            </div>
            <div className="text-base sm:text-lg font-bold text-blue-700">Rs. {item.price.toLocaleString()}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`${getGridClasses()} max-w-7xl mx-auto`}>
      {filteredItems.map(item => (
        <div
          key={item.id}
          onClick={() => addToOrder(item)}
          className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className={`relative overflow-hidden bg-gray-100 ${cardSize === 'large' ? 'aspect-[4/3]' : 'aspect-square'}`}>
            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
          </div>
          <div className={`p-2 sm:p-3 ${cardSize === 'small' ? 'p-1.5' : ''}`}>
            <h3 className={`font-medium text-gray-900 truncate text-xs sm:text-sm ${cardSize === 'small' ? 'text-xs' : ''}`}>
              {item.name}
            </h3>
            <p className={`font-bold text-blue-700 mt-1 text-sm sm:text-base ${cardSize === 'small' ? 'text-xs' : ''}`}>
              Rs. {item.price.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuItems;