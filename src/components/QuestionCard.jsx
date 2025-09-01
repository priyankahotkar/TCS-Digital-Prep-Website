import React from 'react';
import { Flag, ChevronLeft, ChevronRight } from 'lucide-react';

export default function QuestionCard({ 
  question, 
  questionNumber, 
  totalQuestions, 
  selectedAnswer, 
  onAnswerSelect, 
  isMarked, 
  onToggleMark,
  onPrevious,
  onNext,
  canGoNext,
  canGoPrevious 
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-3">
          <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
            Question {questionNumber} of {totalQuestions}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            question.type === 'quantitative' ? 'bg-blue-100 text-blue-700' :
            question.type === 'logical' ? 'bg-purple-100 text-purple-700' :
            'bg-green-100 text-green-700'
          }`}>
            {question.type}
          </span>
        </div>
        
        <button
          onClick={onToggleMark}
          className={`flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors duration-200 ${
            isMarked 
              ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Flag className="h-4 w-4" />
          <span className="text-sm">{isMarked ? 'Marked' : 'Mark'}</span>
        </button>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-6 leading-relaxed">
          {question.question}
        </h3>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedAnswer === index
                  ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={index}
                checked={selectedAnswer === index}
                onChange={() => onAnswerSelect(index)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                selectedAnswer === index
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-gray-300'
              }`}>
                {selectedAnswer === index && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className="text-gray-700 flex-1">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            canGoPrevious
              ? 'text-gray-700 hover:bg-gray-100'
              : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
            canGoNext
              ? 'bg-primary-600 hover:bg-primary-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}