import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import TestResults from '../components/TestResults';
import { generateTestQuestions } from '../utils/testUtils';

export default function Results() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();

  // Redirect if no results
  if (!state.results) {
    navigate('/');
    return null;
  }

  const handleRetakeTest = () => {
    const questions = generateTestQuestions();
    dispatch({ type: 'START_TEST', payload: questions });
    navigate('/test');
  };

  const handleGoHome = () => {
    dispatch({ type: 'RESET_TEST' });
    navigate('/');
  };

  return (
    <TestResults
      results={state.results}
      questions={state.currentTest}
      onRetakeTest={handleRetakeTest}
      onGoHome={handleGoHome}
    />
  );
}