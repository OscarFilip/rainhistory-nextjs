import RainHistory from './features/rain-history/RainHistory';

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Rain History Dashboard
        </h1>
        <RainHistory />
      </div>
    </div>
  );
}