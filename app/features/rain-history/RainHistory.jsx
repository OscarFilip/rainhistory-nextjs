"use client";

import React, { useState } from 'react';
import RainHistoryChart from './RainHistoryChart';

function RainHistory() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!latitude || !longitude) return;
    
    setLoading(true);
    setStation(null);
    setError(null);
    
    try {
      const response = await fetch(`/api/rain-history/rainy-days?latitude=${latitude}&longitude=${longitude}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setStation(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const sortedData = station?.rainFallMeasurements
    ? [...station.rainFallMeasurements].sort((a, b) => {
        // Sort by date (newest first)
        return new Date(b.date) - new Date(a.date);
      })
    : [];

  return (
    <div className="max-w-2xl mx-auto mt-8 font-sans">
      <h2 className="text-2xl font-bold text-center mb-6">Rain History</h2>
      
      {/* Quick Location Buttons */}
      <div className="flex gap-2 mb-4 justify-center flex-wrap">
        <button
          onClick={() => {setLatitude('57.1134'); setLongitude('12.7732');}}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
        >
          Ullared, Sweden
        </button>
        <button
          onClick={() => {setLatitude('59.3293'); setLongitude('18.0686');}}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
        >
          Stockholm
        </button>
        <button
          onClick={() => {setLatitude('57.7089'); setLongitude('11.9746');}}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
        >
          Gothenburg
        </button>
      </div>
      
      <div className="flex gap-4 mb-6 justify-center">
        <input
          type="text"
          placeholder="Latitude"
          value={latitude}
          onChange={e => setLatitude(e.target.value)}
          className="px-3 py-2 rounded border border-gray-300 w-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Longitude"
          value={longitude}
          onChange={e => setLongitude(e.target.value)}
          className="px-3 py-2 rounded border border-gray-300 w-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={fetchData}
          disabled={!latitude || !longitude || loading}
          className={`px-4 py-2 rounded text-white font-semibold transition ${
            (!latitude || !longitude || loading)
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Loading...' : 'Fetch Data'}
        </button>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      {station && (
        <div className="bg-white shadow rounded p-6">
          <h3 className="text-xl font-semibold mb-2">{station.title || station.name}</h3>
          <div className="mb-4 text-gray-700 grid grid-cols-2 gap-2">
            <div><span className="font-bold">Station:</span> {station.name}</div>
            <div><span className="font-bold">Key:</span> {station.key}</div>
            <div><span className="font-bold">Latitude:</span> {station.latitude}°</div>
            <div><span className="font-bold">Longitude:</span> {station.longitude}°</div>
            <div><span className="font-bold">Status:</span> 
              <span className={`ml-1 px-2 py-1 rounded text-xs ${station.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {station.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div><span className="font-bold">Data Points:</span> {sortedData.length}</div>
          </div>
          {sortedData.length > 0 && <RainHistoryChart data={sortedData} />}
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Rainfall (mm)</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-2 px-4 border-b">
                      {new Date(item.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b text-right">
                      {Math.round(item.rainFall * 10) / 10}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default RainHistory;