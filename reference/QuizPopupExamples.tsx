import React, { useState } from 'react';
import QuizPopup, { QuizData, QuizOption } from './QuizPopup';

// ===== 기본 사용 예제 =====
export const BasicQuizExample: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  
  const sampleQuiz: QuizData = {
    quizId: 'sample-1',
    quizType: 'multipleChoice',
    questionText: 'What animal says "oink"?',
    options: [
      { text: 'dog', isCorrect: false },
      { text: 'cat', isCorrect: false },
      { text: 'pig', isCorrect: true },
      { text: 'cow', isCorrect: false }
    ]
  };

  const handleAnswer = (isCorrect: boolean, selectedOptionText: string) => {
    console.log(`Answer: ${selectedOptionText}, Correct: ${isCorrect}`);
    // 퀴즈 결과 처리 로직
  };

  return (
    <QuizPopup
      quiz={sampleQuiz}
      team="A"
      onAnswer={handleAnswer}
      isPaused={isPaused}
    />
  );
};

// ===== 커스텀 스타일 예제 =====
export const CustomStyledQuizExample: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  
  const sampleQuiz: QuizData = {
    quizId: 'custom-1',
    quizType: 'multipleChoice',
    questionText: 'Which color represents happiness?',
    options: [
      { text: 'Blue', isCorrect: false },
      { text: 'Yellow', isCorrect: true },
      { text: 'Red', isCorrect: false },
      { text: 'Green', isCorrect: false }
    ]
  };

  const customStyles = {
    modalBackground: 'bg-blue-900/70',
    modalContainer: 'bg-gradient-to-b from-yellow-50 to-orange-50 rounded-3xl shadow-2xl',
    questionText: 'text-6xl font-bold text-center text-blue-900 leading-tight',
    headerText: 'text-3xl font-bold',
    timerText: 'text-3xl font-bold text-orange-600',
  };

  const customTeamColors = {
    A: { name: 'text-blue-600', line: 'bg-blue-600' },
    B: { name: 'text-orange-600', line: 'bg-orange-600' },
  };

  const handleAnswer = (isCorrect: boolean, selectedOptionText: string) => {
    console.log(`Custom Quiz Answer: ${selectedOptionText}, Correct: ${isCorrect}`);
  };

  return (
    <QuizPopup
      quiz={sampleQuiz}
      team="A"
      onAnswer={handleAnswer}
      isPaused={isPaused}
      timeLimit={15}
      teamColors={customTeamColors}
      customStyles={customStyles}
      feedbackDuration={2000}
      exitDelay={800}
    />
  );
};

// ===== 이미지가 포함된 퀴즈 예제 =====
export const ImageQuizExample: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  
  const imageQuiz: QuizData = {
    quizId: 'image-1',
    quizType: 'multipleChoice',
    questionText: 'What is shown in this image?',
    options: [
      { text: 'Mountain', isCorrect: false },
      { text: 'Ocean', isCorrect: true },
      { text: 'Forest', isCorrect: false },
      { text: 'Desert', isCorrect: false }
    ],
    stimulus: {
      imageUrl: '/images/ocean.jpg'
    }
  };

  const handleAnswer = (isCorrect: boolean, selectedOptionText: string) => {
    console.log(`Image Quiz Answer: ${selectedOptionText}, Correct: ${isCorrect}`);
  };

  return (
    <QuizPopup
      quiz={imageQuiz}
      team="B"
      onAnswer={handleAnswer}
      isPaused={isPaused}
      timeLimit={20}
    />
  );
};

// ===== 문장 완성 퀴즈 예제 =====
export const SentenceQuizExample: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  
  const sentenceQuiz: QuizData = {
    quizId: 'sentence-1',
    quizType: 'multipleChoice',
    questionText: 'Complete the sentence:',
    options: [
      { text: 'quickly', isCorrect: false },
      { text: 'slowly', isCorrect: true },
      { text: 'fast', isCorrect: false },
      { text: 'rapidly', isCorrect: false }
    ],
    stimulus: {
      sentence: 'The turtle moves ___ across the road.'
    }
  };

  const handleAnswer = (isCorrect: boolean, selectedOptionText: string) => {
    console.log(`Sentence Quiz Answer: ${selectedOptionText}, Correct: ${isCorrect}`);
  };

  return (
    <QuizPopup
      quiz={sentenceQuiz}
      team="A"
      onAnswer={handleAnswer}
      isPaused={isPaused}
      timeLimit={12}
    />
  );
};

// ===== 타이머 없는 퀴즈 예제 =====
export const NoTimerQuizExample: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  
  const noTimerQuiz: QuizData = {
    quizId: 'no-timer-1',
    quizType: 'multipleChoice',
    questionText: 'What is the capital of France?',
    options: [
      { text: 'London', isCorrect: false },
      { text: 'Berlin', isCorrect: false },
      { text: 'Paris', isCorrect: true },
      { text: 'Madrid', isCorrect: false }
    ]
  };

  const handleAnswer = (isCorrect: boolean, selectedOptionText: string) => {
    console.log(`No Timer Quiz Answer: ${selectedOptionText}, Correct: ${isCorrect}`);
  };

  return (
    <QuizPopup
      quiz={noTimerQuiz}
      team="B"
      onAnswer={handleAnswer}
      isPaused={isPaused}
      showTimer={false}
      showTeamName={false}
    />
  );
};

// ===== 게임 통합 예제 =====
export const GameIntegrationExample: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [score, setScore] = useState(0);
  
  const quizzes: QuizData[] = [
    {
      quizId: 'game-1',
      quizType: 'multipleChoice',
      questionText: 'What is 2 + 2?',
      options: [
        { text: '3', isCorrect: false },
        { text: '4', isCorrect: true },
        { text: '5', isCorrect: false },
        { text: '6', isCorrect: false }
      ]
    },
    {
      quizId: 'game-2',
      quizType: 'multipleChoice',
      questionText: 'What color is the sky?',
      options: [
        { text: 'Red', isCorrect: false },
        { text: 'Blue', isCorrect: true },
        { text: 'Green', isCorrect: false },
        { text: 'Yellow', isCorrect: false }
      ]
    }
  ];

  const startQuiz = (quizIndex: number) => {
    setCurrentQuiz(quizzes[quizIndex]);
  };

  const handleAnswer = (isCorrect: boolean, selectedOptionText: string) => {
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setCurrentQuiz(null);
    console.log(`Score: ${score + (isCorrect ? 1 : 0)}`);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Quiz Game Integration</h1>
      <p className="text-lg mb-6">Score: {score}</p>
      
      <div className="space-y-4">
        {quizzes.map((quiz, index) => (
          <button
            key={quiz.quizId}
            onClick={() => startQuiz(index)}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Start Quiz {index + 1}: {quiz.questionText}
          </button>
        ))}
      </div>

      {currentQuiz && (
        <QuizPopup
          quiz={currentQuiz}
          team="A"
          onAnswer={handleAnswer}
          isPaused={isPaused}
          timeLimit={10}
        />
      )}
    </div>
  );
};

// ===== 퀴즈 생성 유틸리티 함수들 =====
export const createQuiz = (
  id: string,
  question: string,
  options: { text: string; isCorrect: boolean }[],
  stimulus?: { imageUrl?: string; sentence?: string }
): QuizData => ({
  quizId: id,
  quizType: 'multipleChoice',
  questionText: question,
  options,
  stimulus
});

export const createMultipleChoiceQuiz = (
  id: string,
  question: string,
  correctAnswer: string,
  wrongAnswers: string[],
  stimulus?: { imageUrl?: string; sentence?: string }
): QuizData => {
  const options: QuizOption[] = [
    { text: correctAnswer, isCorrect: true },
    ...wrongAnswers.map(answer => ({ text: answer, isCorrect: false }))
  ];
  
  // 옵션들을 랜덤하게 섞기
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return createQuiz(id, question, options, stimulus);
};

// ===== 프리셋 퀴즈 템플릿들 =====
export const QUIZ_PRESETS = {
  math: {
    createAdditionQuiz: (a: number, b: number) => 
      createMultipleChoiceQuiz(
        `math-add-${a}-${b}`,
        `What is ${a} + ${b}?`,
        (a + b).toString(),
        [(a + b + 1).toString(), (a + b - 1).toString(), (a + b + 2).toString()]
      ),
    
    createMultiplicationQuiz: (a: number, b: number) =>
      createMultipleChoiceQuiz(
        `math-mult-${a}-${b}`,
        `What is ${a} × ${b}?`,
        (a * b).toString(),
        [(a * b + 1).toString(), (a * b - 1).toString(), (a * b + 2).toString()]
      )
  },
  
  vocabulary: {
    createDefinitionQuiz: (word: string, definition: string, wrongDefs: string[]) =>
      createMultipleChoiceQuiz(
        `vocab-${word}`,
        `What does "${word}" mean?`,
        definition,
        wrongDefs
      ),
    
    createSynonymQuiz: (word: string, synonym: string, wrongSynonyms: string[]) =>
      createMultipleChoiceQuiz(
        `synonym-${word}`,
        `What is a synonym for "${word}"?`,
        synonym,
        wrongSynonyms
      )
  },
  
  general: {
    createCapitalQuiz: (country: string, capital: string, wrongCapitals: string[]) =>
      createMultipleChoiceQuiz(
        `capital-${country}`,
        `What is the capital of ${country}?`,
        capital,
        wrongCapitals
      ),
    
    createAnimalQuiz: (question: string, correctAnimal: string, wrongAnimals: string[]) =>
      createMultipleChoiceQuiz(
        `animal-${correctAnimal}`,
        question,
        correctAnimal,
        wrongAnimals
      )
  }
};
