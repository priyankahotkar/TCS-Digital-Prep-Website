import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, TrendingUp, Users, BookOpen, Star, Clock, BarChart3 } from 'lucide-react';
import TestCard from '../components/TestCard';
import TestInstructions from '../components/TestInstructions';
import { useApp } from '../context/AppContext';
import { generateTestQuestions } from '../utils/testUtils';
import Footer from '../components/Footer';

export default function Home() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [showInstructions, setShowInstructions] = useState(false);

  const handleStartTest = () => {
    setShowInstructions(true);
  };

  const handleConfirmStart = () => {
    const questions = generateTestQuestions();
    dispatch({ type: 'START_TEST', payload: questions });
    setShowInstructions(false);
    navigate('/test');
  };

  const recentTests = state.testHistory.slice(-3);
  const averageScore = state.testHistory.length > 0 
    ? Math.round(state.testHistory.reduce((sum, test) => sum + (test.score / test.totalQuestions) * 100, 0) / state.testHistory.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
              TCS Digital Prep
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 animate-slide-up">
              Master the TCS Digital aptitude test with realistic simulations
            </p>
            <button
              onClick={handleStartTest}
              className="bg-white text-primary-600 hover:bg-primary-50 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2 mx-auto"
            >
              <Play className="h-6 w-6" />
              <span>Start Practice Test</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {state.testHistory.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <TrendingUp className="h-12 w-12 text-success-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">{averageScore}%</h3>
              <p className="text-gray-600">Average Score</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">{state.testHistory.length}</h3>
              <p className="text-gray-600">Tests Attempted</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <Star className="h-12 w-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900">
                {Math.max(...state.testHistory.map(test => Math.round((test.score / test.totalQuestions) * 100)), 0)}%
              </h3>
              <p className="text-gray-600">Best Score</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Test Card */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Practice Tests</h2>
            <TestCard
              title="TCS Digital Aptitude Test"
              description="Complete simulation of the actual TCS Digital aptitude test with the same question pattern and difficulty level."
              duration={25}
              questions={25}
              difficulty="medium"
              onStart={handleStartTest}
            />
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/progress')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <BarChart3 className="h-5 w-5 text-primary-600" />
                  <span className="text-gray-700">View Progress</span>
                </button>
                <button
                  onClick={() => navigate('/forum')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <Users className="h-5 w-5 text-primary-600" />
                  <span className="text-gray-700">Discussion Forum</span>
                </button>
                <button
                  onClick={() => navigate('/faq')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <BookOpen className="h-5 w-5 text-primary-600" />
                  <span className="text-gray-700">FAQ</span>
                </button>
              </div>
            </div>

            {/* Recent Tests */}
            {recentTests.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tests</h3>
                <div className="space-y-3">
                  {recentTests.map((test, index) => (
                    <div key={test.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">
                          Test #{state.testHistory.length - index}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(test.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-primary-600">
                          {Math.round((test.score / test.totalQuestions) * 100)}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {test.score}/{test.totalQuestions}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />

      {/* Instructions Modal */}
      {showInstructions && (
        <TestInstructions
          onStart={handleConfirmStart}
          onCancel={() => setShowInstructions(false)}
        />
      )}
    </div>
  );
}