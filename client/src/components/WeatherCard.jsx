import React from 'react';

const WeatherCard = ({ data }) => {
  return (
    <div className="mt-8 w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">{data.city}</h2>
          <img src={data.icon} alt={data.condition} className="w-16 h-16" />
        </div>
        <p className="text-5xl font-bold mt-2">{Math.round(data.temperature)}°C</p>
        <p className="text-xl capitalize">{data.condition}</p>
        <p className="text-sm">{data.description}</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-gray-500">Humidity</p>
            <p className="text-xl font-semibold">{data.humidity}%</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-gray-500">Wind Speed</p>
            <p className="text-xl font-semibold">{data.windSpeed} m/s</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;