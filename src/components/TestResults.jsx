import React from 'react';
import { Trophy, Clock, Target, BarChart3, RotateCcw, Home } from 'lucide-react';
import { formatTime, getPerformanceLevel } from '../utils/testUtils';

export default function TestResults({ results, questions, onRetakeTest, onGoHome }) {
  const { score, totalQuestions, percentage, categoryScores, timeTaken } = results;
  const performanceLevel = getPerformanceLevel(percentage);

  const categoryPercentages = {
    quantitative: Math.round((categoryScores.quantitative.correct / categoryScores.quantitative.total) * 100),
    logical: Math.round((categoryScores.logical.correct / categoryScores.logical.total) * 100),
    verbal: Math.round((categoryScores.verbal.correct / categoryScores.verbal.total) * 100),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Test Completed!</h1>
          <p className="text-gray-600">Here's how you performed on the TCS Digital simulation</p>
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-8">
            <div className="text-6xl font-bold text-primary-600 mb-2">{percentage}%</div>
            <div className={`text-xl font-semibold ${performanceLevel.color} mb-4`}>
              {performanceLevel.level}
            </div>
            <div className="text-gray-600">
              {score} out of {totalQuestions} questions correct
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Target className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{score}/{totalQuestions}</div>
              <div className="text-sm text-gray-600">Questions Correct</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Clock className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{formatTime(timeTaken)}</div>
              <div className="text-sm text-gray-600">Time Taken</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <BarChart3 className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{percentage}%</div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Section-wise Performance</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-blue-900">Quantitative Aptitude</h4>
                <p className="text-sm text-blue-700">
                  {categoryScores.quantitative.correct}/{categoryScores.quantitative.total} questions
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{categoryPercentages.quantitative}%</div>
                <div className="w-32 bg-blue-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${categoryPercentages.quantitative}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-purple-900">Logical Reasoning</h4>
                <p className="text-sm text-purple-700">
                  {categoryScores.logical.correct}/{categoryScores.logical.total} questions
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{categoryPercentages.logical}%</div>
                <div className="w-32 bg-purple-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${categoryPercentages.logical}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-green-900">Verbal Ability</h4>
                <p className="text-sm text-green-700">
                  {categoryScores.verbal.correct}/{categoryScores.verbal.total} questions
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{categoryPercentages.verbal}%</div>
                <div className="w-32 bg-green-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${categoryPercentages.verbal}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onRetakeTest}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <RotateCcw className="h-5 w-5" />
            <span>Retake Test</span>
          </button>
          <button
            onClick={onGoHome}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>Go to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}