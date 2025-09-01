import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const AppContext = createContext();

const initialState = {
  user: null,
  isLoading: true, // Add loading state
  testHistory: [],
  currentTest: null,
  testStartTime: null,
  answers: {},
  currentQuestionIndex: 0,
  markedQuestions: new Set(),
  timeRemaining: 25 * 60, // 25 minutes in seconds
  isTestActive: false,
  testSubmitted: false,
  results: null,
  isAuthenticated: false, // Add email verification status
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload,
        isLoading: false,
        isAuthenticated: !!action.payload && action.payload.emailVerified,
      };
      
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    
    case 'START_TEST':
      return {
        ...state,
        currentTest: action.payload,
        testStartTime: Date.now(),
        answers: {},
        currentQuestionIndex: 0,
        markedQuestions: new Set(),
        timeRemaining: 25 * 60,
        isTestActive: true,
        testSubmitted: false,
        results: null,
      };
    
    case 'SET_ANSWER':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.answer,
        },
      };
    
    case 'SET_CURRENT_QUESTION':
      return { ...state, currentQuestionIndex: action.payload };
    
    case 'TOGGLE_MARK_QUESTION':
      const newMarked = new Set(state.markedQuestions);
      if (newMarked.has(action.payload)) {
        newMarked.delete(action.payload);
      } else {
        newMarked.add(action.payload);
      }
      return { ...state, markedQuestions: newMarked };
    
    case 'UPDATE_TIME':
      return { ...state, timeRemaining: Math.max(0, state.timeRemaining - 1) };
    
    case 'SUBMIT_TEST':
      const testResult = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        answers: state.answers,
        score: action.payload.score,
        totalQuestions: action.payload.totalQuestions,
        timeTaken: 25 * 60 - state.timeRemaining,
        categoryScores: action.payload.categoryScores,
      };
      
      return {
        ...state,
        isTestActive: false,
        testSubmitted: true,
        results: testResult,
        testHistory: [...state.testHistory, testResult],
      };
    
    case 'RESET_TEST':
      return {
        ...state,
        currentTest: null,
        testStartTime: null,
        answers: {},
        currentQuestionIndex: 0,
        markedQuestions: new Set(),
        timeRemaining: 25 * 60,
        isTestActive: false,
        testSubmitted: false,
        results: null,
      };
    
    case 'LOAD_TEST_HISTORY':
      return { ...state, testHistory: action.payload };
    
    case 'LOGOUT':
      // Sign out from Firebase
      auth.signOut().catch(error => {
        console.error('Error signing out:', error);
      });
      
      // Clear localStorage
      localStorage.removeItem('testHistory');
      localStorage.removeItem('user');
      
      // Reset state
      return {
        ...initialState,
        user: null,
        isLoading: false,
        testHistory: [],
        isAuthenticated: false,
      };
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Force token refresh to get the latest email verification status
        await user.getIdToken(true);
        // Reload the user to get the latest data
        await user.reload();
      }
      dispatch({ type: 'SET_USER', payload: user });
    });
    
    return () => unsubscribe();
  }, []);
  
  // Load test history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('testHistory');
    const savedUser = localStorage.getItem('user');
    
    if (savedHistory) {
      dispatch({ type: 'LOAD_TEST_HISTORY', payload: JSON.parse(savedHistory) });
    }
    
    if (savedUser) {
      dispatch({ type: 'SET_USER', payload: JSON.parse(savedUser) });
    }
  }, []);

  // Save test history to localStorage when it changes
  useEffect(() => {
    if (state.testHistory.length > 0) {
      localStorage.setItem('testHistory', JSON.stringify(state.testHistory));
    }
  }, [state.testHistory]);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  }, [state.user]);

  // Timer effect
  useEffect(() => {
    let interval;
    if (state.isTestActive && state.timeRemaining > 0) {
      interval = setInterval(() => {
        dispatch({ type: 'UPDATE_TIME' });
      }, 1000);
    } else if (state.isTestActive && state.timeRemaining === 0) {
      // Auto-submit when time runs out
      // This will be handled in the test component
    }
    return () => clearInterval(interval);
  }, [state.isTestActive, state.timeRemaining]);

  const value = { state, dispatch };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}