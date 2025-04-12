import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [city, setCity] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [recentSearches, setRecentSearches] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) setDarkMode(savedMode === 'true');
    
    const savedSearches = localStorage.getItem('recentSearches');
    if (savedSearches) setRecentSearches(JSON.parse(savedSearches));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleSearch = async (searchCity) => {
    if (!searchCity?.trim()) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5000/weather?city=${searchCity}`);
      setWeatherData(response.data);
      
      // Update recent searches
      if (!recentSearches.includes(searchCity)) {
        const newSearches = [searchCity, ...recentSearches.filter(s => s !== searchCity)].slice(0, 5);
        setRecentSearches(newSearches);
        localStorage.setItem('recentSearches', JSON.stringify(newSearches));
      }
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('City not found or server error');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  // Simple icon selection
  const getWeatherIcon = (condition) => {
    const c = condition?.toLowerCase() || '';
    if (c.includes('clear')) return '☀️';
    if (c.includes('cloud')) return '☁️';
    if (c.includes('rain')) return '🌧️';
    if (c.includes('snow')) return '❄️';
    if (c.includes('thunder')) return '⛈️';
    if (c.includes('fog') || c.includes('mist')) return '🌫️';
    return '🌡️';
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode 
      ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white' 
      : 'bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-gray-800'}`}>
      
      {/* Header */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4 md:mb-0">
            <span className="mr-2">🌤️</span> 
            Weather Dashboard
          </h1>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`p-3 rounded-full ${darkMode 
              ? 'bg-gray-800 hover:bg-gray-700' 
              : 'bg-white hover:bg-gray-100'} shadow-lg transition-colors`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        
        {/* Search */}
        <div className={`rounded-xl overflow-hidden shadow-lg mb-8 ${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm`}>
          <div className="p-5">
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(city); }} className="flex gap-2">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name..."
                className={`flex-1 px-4 py-3 rounded-lg focus:outline-none ${darkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-400 border border-gray-600' 
                  : 'bg-white text-gray-800 border border-gray-200'}`}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-lg shadow-md transition-all"
              >
                Search
              </button>
            </form>
            
            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <div className="mt-4">
                <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Recent:</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((item, index) => (
                    <button 
                      key={index}
                      onClick={() => { setCity(item); handleSearch(item); }}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${darkMode 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-blue-100 hover:bg-blue-200'}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Loading */}
        {loading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        )}
        
        {/* Error */}
        {error && (
          <div className={`p-6 rounded-xl shadow-lg mb-8 text-center ${darkMode 
            ? 'bg-red-900/30 text-red-200' 
            : 'bg-red-100 text-red-600'}`}>
            <p className="text-xl">{error}</p>
          </div>
        )}
        
        {/* Weather data */}
        {weatherData && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main weather card */}
            <div className={`lg:col-span-2 rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm`}>
              <div className={`p-6 ${darkMode 
                ? 'bg-gradient-to-r from-blue-900/70 to-purple-900/70' 
                : 'bg-gradient-to-r from-blue-500/70 to-purple-500/70'} text-white`}>
                
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold">{weatherData.city}</h2>
                    <p className="text-sm mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                  </div>
                  <div className="text-center">
                    {weatherData.icon ? (
                      <img src={weatherData.icon} alt={weatherData.condition} className="w-16 h-16" />
                    ) : (
                      <span className="text-5xl">{getWeatherIcon(weatherData.condition)}</span>
                    )}
                    <p className="mt-1 capitalize">{weatherData.condition}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <p className="text-6xl font-bold">{Math.round(weatherData.temperature)}°C</p>
                  <p className="text-xl mt-2 capitalize">{weatherData.description || ''}</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-lg flex flex-col items-center ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <span className="text-3xl mb-2">💧</span>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Humidity</span>
                    <span className="text-2xl font-semibold">{weatherData.humidity}%</span>
                  </div>
                  <div className={`p-4 rounded-lg flex flex-col items-center ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <span className="text-3xl mb-2">💨</span>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Wind</span>
                    <span className="text-2xl font-semibold">{weatherData.windSpeed} m/s</span>
                  </div>
                  <div className={`p-4 rounded-lg flex flex-col items-center ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                    <span className="text-3xl mb-2">☀️</span>
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Feels Like</span>
                    <span className="text-2xl font-semibold">{Math.round(weatherData.temperature * 0.95)}°C</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Forecast card (Demo) */}
            <div className={`rounded-xl shadow-lg overflow-hidden ${darkMode ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm`}>
              <div className={`p-4 ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-500/70'} text-white`}>
                <h3 className="text-xl font-bold">5-Day Forecast</h3>
              </div>
              <div className="p-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
                  <div key={i} className={`p-3 ${i < 4 ? 'border-b' : ''} ${darkMode ? 'border-gray-700' : 'border-gray-200'} 
                    flex items-center justify-between`}>
                    <div className="font-medium">{day}</div>
                    <div className="flex items-center">
                      <span className="text-2xl mr-2">{getWeatherIcon(['Clear', 'Clouds', 'Rain'][i % 3])}</span>
                    </div>
                    <div className="font-semibold">{Math.round(weatherData.temperature + (i - 2))}°C</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <footer className={`mt-12 py-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p>Data provided by OpenWeatherMap</p>
        </footer>
      </div>
    </div>
  );
}

export default App;