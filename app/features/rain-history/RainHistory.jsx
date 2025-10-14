"use client";

import React, { useState } from 'react';
import RainHistoryChart from './RainHistoryChart';

function RainHistory() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    if (!latitude || !longitude) return;
    setLoading(true);
    fetch(`https://localhost:7086/RainHistory/RainyDays?latitude=${latitude}&longitude=${longitude}`)
      .then(response => response.json())
      .then(json => {
        setStation(json);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  const sortedData = station?.data
    ? [...station.data].sort((a, b) => {
        const today = new Date();
        const diffA = Math.abs(new Date(a.date) - today);
        const diffB = Math.abs(new Date(b.date) - today);
        return diffA - diffB;
      })
    : [];

  return (
    <div className="max-w-2xl mx-auto mt-8 font-sans">
      <h2 className="text-2xl font-bold text-center mb-6">Rain History</h2>
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
      {station && (
        <div className="bg-white shadow rounded p-6">
          <h3 className="text-xl font-semibold mb-2">{station.title}</h3>
          <p className="mb-4 text-gray-700">
            <span className="font-bold">Station:</span> {station.name}<br />
            <span className="font-bold">Lat:</span> {station.latitude} &nbsp;
            <span className="font-bold">Lon:</span> {station.longitude}
          </p>
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
                      {item.rainFall}
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