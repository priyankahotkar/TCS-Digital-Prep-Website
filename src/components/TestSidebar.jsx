import React from 'react';
import { Clock, Flag, CheckCircle, Circle } from 'lucide-react';
import { formatTime } from '../utils/testUtils';

export default function TestSidebar({ 
  questions, 
  currentIndex, 
  answers, 
  markedQuestions, 
  timeRemaining, 
  onQuestionSelect,
  onSubmit 
}) {
  const answeredCount = Object.keys(answers).length;
  const markedCount = markedQuestions.size;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
      {/* Timer */}
      <div className="text-center mb-6 pb-6 border-b border-gray-200">
        <div className={`text-3xl font-bold mb-2 ${
          timeRemaining < 300 ? 'text-red-600' : 'text-gray-900'
        }`}>
          {formatTime(timeRemaining)}
        </div>
        <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>Time Remaining</span>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600">{answeredCount}</div>
          <div className="text-xs text-gray-500">Answered</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{markedCount}</div>
          <div className="text-xs text-gray-500">Marked</div>
        </div>
      </div>

      {/* Question Grid */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Question Navigator</h4>
        <div className="grid grid-cols-5 gap-2">
          {questions.map((question, index) => {
            const isAnswered = answers.hasOwnProperty(question.id);
            const isMarked = markedQuestions.has(question.id);
            const isCurrent = index === currentIndex;

            return (
              <button
                key={question.id}
                onClick={() => onQuestionSelect(index)}
                className={`w-10 h-10 rounded-lg border-2 text-sm font-medium transition-all duration-200 flex items-center justify-center relative ${
                  isCurrent
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : isAnswered
                    ? 'border-green-500 bg-green-100 text-green-700 hover:bg-green-200'
                    : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                {index + 1}
                {isMarked && (
                  <Flag className="h-3 w-3 absolute -top-1 -right-1 text-yellow-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-100 border border-green-500 rounded"></div>
            <span className="text-gray-600">Answered</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
            <span className="text-gray-600">Not Answered</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-primary-500 rounded"></div>
            <span className="text-gray-600">Current</span>
          </div>
          <div className="flex items-center space-x-2">
            <Flag className="h-4 w-4 text-yellow-500" />
            <span className="text-gray-600">Marked</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={onSubmit}
        className="w-full bg-success-600 hover:bg-success-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
      >
        <CheckCircle className="h-4 w-4" />
        <span>Submit Test</span>
      </button>
    </div>
  );
}