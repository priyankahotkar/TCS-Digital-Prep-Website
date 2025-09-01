import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import QuestionCard from '../components/QuestionCard';
import TestSidebar from '../components/TestSidebar';
import { calculateScore } from '../utils/testUtils';

export default function Test() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Redirect if no test is active
  useEffect(() => {
    if (!state.isTestActive || !state.currentTest) {
      navigate('/');
    }
  }, [state.isTestActive, state.currentTest, navigate]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (state.timeRemaining === 0 && state.isTestActive) {
      handleSubmitTest();
    }
  }, [state.timeRemaining, state.isTestActive]);

  const handleAnswerSelect = (answerIndex) => {
    const currentQuestion = state.currentTest[state.currentQuestionIndex];
    dispatch({
      type: 'SET_ANSWER',
      payload: {
        questionId: currentQuestion.id,
        answer: answerIndex,
      },
    });
  };

  const handleQuestionNavigation = (direction) => {
    const newIndex = direction === 'next' 
      ? state.currentQuestionIndex + 1 
      : state.currentQuestionIndex - 1;
    
    if (newIndex >= 0 && newIndex < state.currentTest.length) {
      dispatch({ type: 'SET_CURRENT_QUESTION', payload: newIndex });
    }
  };

  const handleQuestionSelect = (index) => {
    dispatch({ type: 'SET_CURRENT_QUESTION', payload: index });
  };

  const handleToggleMark = () => {
    const currentQuestion = state.currentTest[state.currentQuestionIndex];
    dispatch({ type: 'TOGGLE_MARK_QUESTION', payload: currentQuestion.id });
  };

  const handleSubmitTest = () => {
    const results = calculateScore(state.answers, state.currentTest);
    dispatch({ type: 'SUBMIT_TEST', payload: results });
    navigate('/results');
  };

  const confirmSubmit = () => {
    setShowSubmitConfirm(false);
    handleSubmitTest();
  };

  if (!state.currentTest || !state.isTestActive) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = state.currentTest[state.currentQuestionIndex];
  const selectedAnswer = state.answers[currentQuestion.id];
  const isMarked = state.markedQuestions.has(currentQuestion.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <QuestionCard
              question={currentQuestion}
              questionNumber={state.currentQuestionIndex + 1}
              totalQuestions={state.currentTest.length}
              selectedAnswer={selectedAnswer}
              onAnswerSelect={handleAnswerSelect}
              isMarked={isMarked}
              onToggleMark={handleToggleMark}
              onPrevious={() => handleQuestionNavigation('previous')}
              onNext={() => handleQuestionNavigation('next')}
              canGoNext={state.currentQuestionIndex < state.currentTest.length - 1}
              canGoPrevious={state.currentQuestionIndex > 0}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <TestSidebar
              questions={state.currentTest}
              currentIndex={state.currentQuestionIndex}
              answers={state.answers}
              markedQuestions={state.markedQuestions}
              timeRemaining={state.timeRemaining}
              onQuestionSelect={handleQuestionSelect}
              onSubmit={() => setShowSubmitConfirm(true)}
            />
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
              <h3 className="text-lg font-semibold text-gray-900">Submit Test</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit the test? You have answered{' '}
              <strong>{Object.keys(state.answers).length}</strong> out of{' '}
              <strong>{state.currentTest.length}</strong> questions.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}