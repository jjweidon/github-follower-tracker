'use client';

import { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { TrackedUser, HistoryRecord, PeriodType } from '@/types';
import { format } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  LineController,
  BarController,
  Title,
  Tooltip,
  Legend
);

interface ChartSectionProps {
  userData: TrackedUser;
  onChartClick: (history: HistoryRecord) => void;
}

export default function ChartSection({ userData, onChartClick }: ChartSectionProps) {
  const [period, setPeriod] = useState<PeriodType>('day');

  const history = userData.history.slice(-30);

  const labels = history.map((h) => format(new Date(h.date), 'MM/dd'));
  
  const chartData = {
    labels,
    datasets: [
      {
        type: 'line' as const,
        label: '팔로워 수',
        data: history.map((h) => h.followerCount),
        borderColor: 'rgb(255, 107, 157)',
        backgroundColor: 'rgba(255, 107, 157, 0.5)',
        yAxisID: 'y',
      },
      {
        type: 'line' as const,
        label: '팔로잉 수',
        data: history.map((h) => h.followingCount),
        borderColor: 'rgb(155, 135, 245)',
        backgroundColor: 'rgba(155, 135, 245, 0.5)',
        yAxisID: 'y',
      },
      {
        type: 'bar' as const,
        label: '추가된 팔로워',
        data: history.map((h) => h.followerChanges.added.length),
        backgroundColor: 'rgba(255, 107, 157, 0.6)',
        yAxisID: 'y1',
      },
      {
        type: 'bar' as const,
        label: '취소된 팔로워',
        data: history.map((h) => -h.followerChanges.removed.length),
        backgroundColor: 'rgba(255, 107, 157, 0.3)',
        yAxisID: 'y1',
      },
      {
        type: 'bar' as const,
        label: '추가된 팔로잉',
        data: history.map((h) => h.followingChanges.added.length),
        backgroundColor: 'rgba(155, 135, 245, 0.6)',
        yAxisID: 'y1',
      },
      {
        type: 'bar' as const,
        label: '취소된 팔로잉',
        data: history.map((h) => -h.followingChanges.removed.length),
        backgroundColor: 'rgba(155, 135, 245, 0.3)',
        yAxisID: 'y1',
      },
    ],
  };

  const options: ChartOptions<'bar' | 'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        onChartClick(history[index]);
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e0e0e0',
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#e0e0e0',
        borderColor: '#666',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#e0e0e0',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        ticks: {
          color: '#e0e0e0',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        title: {
          display: true,
          text: '팔로워/팔로잉 수',
          color: '#e0e0e0',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        ticks: {
          color: '#e0e0e0',
        },
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: '변경 수',
          color: '#e0e0e0',
        },
      },
    },
  };

  return (
    <div className="relative group mb-10">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/10 to-accent-purple/10 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity blur-xl" />
      <div className="relative bg-dark-tertiary/60 backdrop-blur-sm border border-accent-cyan/20 rounded-2xl p-6 hover:border-accent-purple/30 transition-all">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="h-1 w-1 rounded-full bg-accent-purple animate-pulse" />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              히스토리
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPeriod('day')}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                period === 'day'
                  ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-bold shadow-lg shadow-accent-cyan/30'
                  : 'bg-dark-secondary/50 text-gray-400 hover:bg-dark-secondary hover:text-white border border-accent-cyan/20'
              }`}
            >
              일
            </button>
            <button
              onClick={() => setPeriod('week')}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                period === 'week'
                  ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-bold shadow-lg shadow-accent-cyan/30'
                  : 'bg-dark-secondary/50 text-gray-400 hover:bg-dark-secondary hover:text-white border border-accent-cyan/20'
              }`}
            >
              주
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                period === 'month'
                  ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-white font-bold shadow-lg shadow-accent-cyan/30'
                  : 'bg-dark-secondary/50 text-gray-400 hover:bg-dark-secondary hover:text-white border border-accent-cyan/20'
              }`}
            >
              월
            </button>
          </div>
        </div>
        
        <div className="bg-dark-primary/50 backdrop-blur-sm border border-accent-cyan/10 rounded-xl p-4" style={{ height: '400px' }}>
          <Chart type="bar" data={chartData} options={options} />
        </div>
        
        <p className="text-gray-500 text-sm mt-4 text-center font-mono">
          <span className="text-accent-cyan/70">// </span>
          차트의 데이터 포인트를 클릭하면 해당 날짜의 상세 정보를 볼 수 있습니다
        </p>
      </div>
    </div>
  );
}

