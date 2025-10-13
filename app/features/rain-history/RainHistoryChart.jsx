import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function RainHistoryChart({ data }) {
  // Show the latest 30 days
  const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  const recent = sorted.slice(-30);

  const chartData = {
    labels: recent.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Rainfall (mm)',
        data: recent.map(item => item.rainFall),
        backgroundColor: 'rgba(37, 99, 235, 0.7)',
        barPercentage: 1.2,        // Thinner bars
        categoryPercentage: 0.3,   // Less spacing between bars
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'mm' } },
    //   x: { title: { display: true, text: 'Date' } }
    x: {
        title: { display: true, text: 'Date' },
        ticks: {
          autoSkip: false,
          maxTicksLimit: 10, // Show only 10 date labels
          maxRotation: 60,   // Rotate labels for clarity
          minRotation: 45,
        },
      },
    }
  };

  return (
    <div className="my-8">
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default RainHistoryChart;