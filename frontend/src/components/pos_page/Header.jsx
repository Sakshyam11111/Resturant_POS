// Add debounced search function
const [aiSearchResults, setAiSearchResults] = useState([]);
const [showAiSearch, setShowAiSearch] = useState(false);

// Add this useEffect for AI search
useEffect(() => {
  const delayDebounceFn = setTimeout(async () => {
    if (searchQuery.length > 2) {
      try {
        const response = await fetch(`http://localhost:5000/api/ai/search?query=${searchQuery}`);
        const results = await response.json();
        setAiSearchResults(results);
        setShowAiSearch(true);
      } catch (error) {
        console.error('AI search failed:', error);
      }
    } else {
      setShowAiSearch(false);
    }
  }, 300);

  return () => clearTimeout(delayDebounceFn);
}, [searchQuery]);

// Add AI search results dropdown to Header
{showAiSearch && aiSearchResults.length > 0 && (
  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
    {aiSearchResults.map(item => (
      <div
        key={item.id}
        onClick={() => {
          addToOrder({
            id: item.name,
            name: item.name,
            price: item.price,
            image: 'https://via.placeholder.com/150',
            category: item.category
          });
          setSearchQuery('');
          setShowAiSearch(false);
        }}
        className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
      >
        <div className="flex justify-between items-center">
          <div>
            <div className="font-medium text-gray-900">{item.name}</div>
            <div className="text-xs text-gray-500 mt-1">
              {item.ingredients.slice(0, 3).join(', ')}
            </div>
          </div>
          <div className="text-sm font-semibold text-blue-600">
            Rs. {item.price.toLocaleString()}
          </div>
        </div>
      </div>
    ))}
  </div>
)}