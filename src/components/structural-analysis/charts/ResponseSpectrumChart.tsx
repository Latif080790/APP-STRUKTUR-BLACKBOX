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
  Filler,
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
  Legend,
  Filler
);

export interface SpectrumPoint {
  period: number;
  acceleration: number;
}

interface ResponseSpectrumChartProps {
  data: SpectrumPoint[];
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  width?: string | number;
  height?: string | number;
  showGrid?: boolean;
  showLegend?: boolean;
  showPoints?: boolean;
  lineColor?: string;
  fillColor?: string;
  responsive?: boolean;
  maintainAspectRatio?: boolean;
}

const defaultProps = {
  title: 'Spektrum Respons Desain',
  xAxisLabel: 'Periode, T (detik)',
  yAxisLabel: 'Spektral Acceleration, Sa (g)',
  width: '100%',
  height: 400,
  showGrid: true,
  showLegend: true,
  showPoints: true,
  lineColor: 'rgb(59, 130, 246)',
  fillColor: 'rgba(59, 130, 246, 0.1)',
  responsive: true,
  maintainAspectRatio: true,
};

export const ResponseSpectrumChart: React.FC<ResponseSpectrumChartProps> = (props) => {
  const {
    data,
    title,
    xAxisLabel,
    yAxisLabel,
    width,
    height,
    showGrid,
    showLegend,
    showPoints,
    lineColor,
    fillColor,
    responsive,
    maintainAspectRatio,
  } = { ...defaultProps, ...props };

  // Siapkan data untuk chart
  const chartData: ChartData<'line'> = {
    labels: data.map(point => point.period.toFixed(2)),
    datasets: [
      {
        label: 'Spektrum Respons',
        data: data.map(point => point.acceleration),
        borderColor: lineColor,
        backgroundColor: fillColor,
        borderWidth: 2,
        pointRadius: showPoints ? 3 : 0,
        pointHoverRadius: 5,
        pointBackgroundColor: lineColor,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: lineColor,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Konfigurasi chart
  const options: ChartOptions<'line'> = {
    responsive,
    maintainAspectRatio: maintainAspectRatio,
    plugins: {
      legend: {
        display: showLegend,
        position: 'top' as const,
      },
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toFixed(3)}g`;
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
          display: showGrid,
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
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
          display: showGrid,
          color: 'rgba(0, 0, 0, 0.05)',
        },
        min: 0,
        ticks: {
          callback: (value) => `${value}g`,
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div style={{ width, height }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default ResponseSpectrumChart;
