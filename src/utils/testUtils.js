import questionsData from '../data/questions.json';

export function generateTestQuestions() {
  const { quantitative, logical, verbal } = questionsData;
  
  // Shuffle and select questions according to TCS Digital pattern
  const selectedQuantitative = shuffleArray([...quantitative]).slice(0, 15);
  const selectedLogical = shuffleArray([...logical]).slice(0, 8);
  const selectedVerbal = shuffleArray([...verbal]).slice(0, 2);
  
  // Combine and shuffle the final question set
  const allQuestions = [
    ...selectedQuantitative,
    ...selectedLogical,
    ...selectedVerbal,
  ];
  
  return shuffleArray(allQuestions);
}

export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function calculateScore(answers, questions) {
  let correct = 0;
  let categoryScores = {
    quantitative: { correct: 0, total: 0 },
    logical: { correct: 0, total: 0 },
    verbal: { correct: 0, total: 0 },
  };

  questions.forEach((question) => {
    const userAnswer = answers[question.id];
    const isCorrect = userAnswer === question.correct;
    
    if (isCorrect) {
      correct++;
      categoryScores[question.type].correct++;
    }
    categoryScores[question.type].total++;
  });

  return {
    score: correct,
    totalQuestions: questions.length,
    percentage: Math.round((correct / questions.length) * 100),
    categoryScores,
  };
}

export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function getPerformanceLevel(percentage) {
  if (percentage >= 90) return { level: 'Excellent', color: 'text-green-600' };
  if (percentage >= 80) return { level: 'Very Good', color: 'text-blue-600' };
  if (percentage >= 70) return { level: 'Good', color: 'text-yellow-600' };
  if (percentage >= 60) return { level: 'Average', color: 'text-orange-600' };
  return { level: 'Needs Improvement', color: 'text-red-600' };
}