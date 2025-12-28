import { JSX } from 'react';
import RainHistory from './features/rain-history/WeatherHistory';

export default function Page(): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Weather History Dashboard
        </h1>
        <RainHistory />
      </div>
    </div>
  );
}