import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import { Calendar, TrendingUp, Target, Clock, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatTime, getPerformanceLevel } from '../utils/testUtils';
import { format } from 'date-fns';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Progress() {
  const { state } = useApp();
  const { testHistory } = state;

  if (testHistory.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Tests Attempted Yet</h2>
            <p className="text-gray-600 mb-8">Take your first practice test to start tracking your progress</p>
            <button
              onClick={() => window.location.href = '/'}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Take Your First Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalTests = testHistory.length;
  const averageScore = Math.round(
    testHistory.reduce((sum, test) => sum + (test.score / test.totalQuestions) * 100, 0) / totalTests
  );
  const bestScore = Math.max(
    ...testHistory.map(test => Math.round((test.score / test.totalQuestions) * 100))
  );
  const averageTime = Math.round(
    testHistory.reduce((sum, test) => sum + test.timeTaken, 0) / totalTests
  );

  // Prepare chart data
  const lineChartData = {
    labels: testHistory.map((_, index) => `Test ${index + 1}`),
    datasets: [
      {
        label: 'Score Percentage',
        data: testHistory.map(test => Math.round((test.score / test.totalQuestions) * 100)),
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.3,
        pointBackgroundColor: 'rgb(37, 99, 235)',
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(37, 99, 235, 0.3)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          },
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  // Category performance data
  const categoryData = {
    quantitative: [],
    logical: [],
    verbal: [],
  };

  testHistory.forEach(test => {
    Object.keys(categoryData).forEach(category => {
      if (test.categoryScores[category]) {
        const percentage = Math.round(
          (test.categoryScores[category].correct / test.categoryScores[category].total) * 100
        );
        categoryData[category].push(percentage);
      }
    });
  });

  const latestCategoryPerformance = {
    quantitative: categoryData.quantitative[categoryData.quantitative.length - 1] || 0,
    logical: categoryData.logical[categoryData.logical.length - 1] || 0,
    verbal: categoryData.verbal[categoryData.verbal.length - 1] || 0,
  };

  const doughnutData = {
    labels: ['Quantitative', 'Logical', 'Verbal'],
    datasets: [
      {
        data: [
          latestCategoryPerformance.quantitative,
          latestCategoryPerformance.logical,
          latestCategoryPerformance.verbal,
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(139, 92, 246)',
          'rgb(16, 185, 129)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed}%`;
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Analytics</h1>
          <p className="text-gray-600">Track your performance and improvement over time</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Best Score</p>
                <p className="text-2xl font-bold text-gray-900">{bestScore}%</p>
              </div>
              <Award className="h-8 w-8 text-success-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tests Taken</p>
                <p className="text-2xl font-bold text-gray-900">{totalTests}</p>
              </div>
              <Target className="h-8 w-8 text-secondary-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Time</p>
                <p className="text-2xl font-bold text-gray-900">{formatTime(averageTime)}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Score Trend Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Score Trend</h3>
            <div className="h-64">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Latest Category Performance</h3>
            <div className="h-64">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        {/* Test History */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Test History</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Taken
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testHistory.map((test, index) => {
                  const percentage = Math.round((test.score / test.totalQuestions) * 100);
                  const performance = getPerformanceLevel(percentage);
                  
                  return (
                    <tr key={test.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Test #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(test.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-semibold">{percentage}%</span>
                        <span className="text-gray-500 ml-1">({test.score}/{test.totalQuestions})</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTime(test.timeTaken)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${performance.color} bg-opacity-10`}>
                          {performance.level}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}