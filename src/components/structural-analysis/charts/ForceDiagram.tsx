import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export interface ForceDataPoint {
  position: number; // Posisi sepanjang elemen (0-1)
  value: number;    // Nilai momen/gaya geser
}

interface ForceDiagramProps {
  data: ForceDataPoint[];
  title: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  lineColor?: string;
  fillColor?: string;
  fill?: boolean;
  width?: string | number;
  height?: string | number;
}

const ForceDiagram: React.FC<ForceDiagramProps> = ({
  data,
  title,
  xAxisLabel = 'Posisi',
  yAxisLabel = 'Nilai',
  lineColor = 'rgb(59, 130, 246)',
  fillColor = 'rgba(59, 130, 246, 0.1)',
  fill = true,
  width = '100%',
  height = 300,
}) => {
  // Siapkan data untuk chart
  const chartData: ChartData<'line'> = {
    labels: data.map(point => `${(point.position * 100).toFixed(0)}%`),
    datasets: [
      {
        label: title,
        data: data.map(point => point.value),
        borderColor: lineColor,
        backgroundColor: fill ? fillColor : 'transparent',
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: lineColor,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: lineColor,
        tension: 0.3,
        fill: fill,
      },
    ],
  };

  // Konfigurasi chart
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: xAxisLabel,
          font: {
            weight: 'bold',
          },
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      y: {
        title: {
          display: true,
          text: yAxisLabel,
          font: {
            weight: 'bold',
          },
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.05)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width, height }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ForceDiagram;
