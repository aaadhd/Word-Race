# QuizPopup 사용 가이드

## 개요

`QuizPopup`은 다른 게임에서 재사용할 수 있는 유연한 퀴즈 컴포넌트입니다. 다양한 커스터마이징 옵션을 제공하여 다양한 게임 스타일에 맞게 조정할 수 있습니다.

## 기본 사용법

```tsx
import QuizPopup, { QuizData } from './QuizPopup';

const MyGame: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  
  const quiz: QuizData = {
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
  };

  return (
    <QuizPopup
      quiz={quiz}
      team="A"
      onAnswer={handleAnswer}
      isPaused={isPaused}
    />
  );
};
```

## Props API

### 필수 Props

| Prop | Type | 설명 |
|------|------|------|
| `quiz` | `QuizData` | 퀴즈 데이터 객체 |
| `team` | `'A' \| 'B'` | 팀 식별자 |
| `onAnswer` | `(isCorrect: boolean, selectedOptionText: string) => void` | 답변 처리 콜백 |
| `isPaused` | `boolean` | 게임 일시정지 상태 |

### 선택적 Props

| Prop | Type | 기본값 | 설명 |
|------|------|--------|------|
| `timeLimit` | `number` | `10` | 퀴즈 제한 시간 (초) |
| `teamColors` | `TeamColors` | `DEFAULT_TEAM_COLORS` | 팀별 색상 설정 |
| `customStyles` | `CustomStyles` | `DEFAULT_CUSTOM_STYLES` | 커스텀 스타일 설정 |
| `showTimer` | `boolean` | `true` | 타이머 표시 여부 |
| `showTeamName` | `boolean` | `true` | 팀명 표시 여부 |
| `feedbackDuration` | `number` | `1500` | 피드백 표시 시간 (ms) |
| `exitDelay` | `number` | `500` | 퀴즈 종료 지연 시간 (ms) |

## 타입 정의

### QuizData

```tsx
interface QuizData {
  quizId: string;
  quizType: 'multipleChoice';
  questionText: string;
  options: QuizOption[];
  stimulus?: QuizStimulus;
}

interface QuizOption {
  text: string;
  isCorrect: boolean;
}

interface QuizStimulus {
  imageUrl?: string;
  sentence?: string;
}
```

### TeamColors

```tsx
interface TeamColors {
  A: { name: string; line: string };
  B: { name: string; line: string };
}
```

### CustomStyles

```tsx
interface CustomStyles {
  modalBackground?: string;
  modalContainer?: string;
  questionText?: string;
  optionButton?: string;
  headerText?: string;
  timerText?: string;
}
```

## 커스터마이징 예제

### 1. 커스텀 색상 테마

```tsx
const customTeamColors = {
  A: { name: 'text-blue-600', line: 'bg-blue-600' },
  B: { name: 'text-orange-600', line: 'bg-orange-600' },
};

const customStyles = {
  modalBackground: 'bg-blue-900/70',
  modalContainer: 'bg-gradient-to-b from-yellow-50 to-orange-50 rounded-3xl shadow-2xl',
  questionText: 'text-6xl font-bold text-center text-blue-900 leading-tight',
  headerText: 'text-3xl font-bold',
  timerText: 'text-3xl font-bold text-orange-600',
};

<QuizPopup
  quiz={quiz}
  team="A"
  onAnswer={handleAnswer}
  isPaused={isPaused}
  teamColors={customTeamColors}
  customStyles={customStyles}
/>
```

### 2. 이미지가 포함된 퀴즈

```tsx
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
```

### 3. 문장 완성 퀴즈

```tsx
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
```

### 4. 타이머 없는 퀴즈

```tsx
<QuizPopup
  quiz={quiz}
  team="A"
  onAnswer={handleAnswer}
  isPaused={isPaused}
  showTimer={false}
  showTeamName={false}
/>
```

## 유틸리티 함수

### 퀴즈 생성 함수

```tsx
import { createQuiz, createMultipleChoiceQuiz, QUIZ_PRESETS } from './QuizPopupExamples';

// 기본 퀴즈 생성
const quiz = createQuiz(
  'math-1',
  'What is 2 + 2?',
  [
    { text: '3', isCorrect: false },
    { text: '4', isCorrect: true },
    { text: '5', isCorrect: false }
  ]
);

// 객관식 퀴즈 생성 (자동으로 옵션 섞기)
const quiz2 = createMultipleChoiceQuiz(
  'vocab-1',
  'What does "happy" mean?',
  'joyful',
  ['sad', 'angry', 'tired']
);

// 프리셋 사용
const mathQuiz = QUIZ_PRESETS.math.createAdditionQuiz(5, 3);
const vocabQuiz = QUIZ_PRESETS.vocabulary.createDefinitionQuiz(
  'happy',
  'feeling joy',
  ['feeling sad', 'feeling angry', 'feeling tired']
);
```

## 게임 통합 예제

### 점수 시스템과 함께 사용

```tsx
const GameWithQuiz: React.FC = () => {
  const [score, setScore] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const handleAnswer = (isCorrect: boolean, selectedOptionText: string) => {
    if (isCorrect) {
      setScore(prev => prev + 10);
    }
    setCurrentQuiz(null);
  };

  const startQuiz = (quiz: QuizData) => {
    setCurrentQuiz(quiz);
  };

  return (
    <div>
      <h1>Score: {score}</h1>
      <button onClick={() => startQuiz(sampleQuiz)}>
        Start Quiz
      </button>
      
      {currentQuiz && (
        <QuizPopup
          quiz={currentQuiz}
          team="A"
          onAnswer={handleAnswer}
          isPaused={isPaused}
        />
      )}
    </div>
  );
};
```

### 팀별 점수 관리

```tsx
const TeamGame: React.FC = () => {
  const [teamScores, setTeamScores] = useState({ A: 0, B: 0 });
  const [currentTeam, setCurrentTeam] = useState<'A' | 'B'>('A');

  const handleAnswer = (isCorrect: boolean, selectedOptionText: string) => {
    if (isCorrect) {
      setTeamScores(prev => ({
        ...prev,
        [currentTeam]: prev[currentTeam] + 1
      }));
    }
    // 다음 팀으로 전환
    setCurrentTeam(prev => prev === 'A' ? 'B' : 'A');
  };

  return (
    <div>
      <div>Team A: {teamScores.A}</div>
      <div>Team B: {teamScores.B}</div>
      
      <QuizPopup
        quiz={currentQuiz}
        team={currentTeam}
        onAnswer={handleAnswer}
        isPaused={false}
      />
    </div>
  );
};
```

## 스타일링 가이드

### Tailwind CSS 클래스 사용

모든 커스텀 스타일은 Tailwind CSS 클래스를 사용합니다:

```tsx
const customStyles = {
  modalBackground: 'bg-black/60', // 반투명 검은 배경
  modalContainer: 'bg-white rounded-2xl shadow-2xl', // 흰색 컨테이너
  questionText: 'text-5xl font-bold text-center text-gray-800 leading-tight',
  headerText: 'text-2xl font-bold',
  timerText: 'text-2xl font-bold text-cyan-500',
};
```

### 색상 테마 예제

```tsx
// 파란색 테마
const blueTheme = {
  modalBackground: 'bg-blue-900/70',
  modalContainer: 'bg-gradient-to-b from-blue-50 to-blue-100',
  questionText: 'text-5xl font-bold text-center text-blue-900',
  headerText: 'text-2xl font-bold text-blue-700',
  timerText: 'text-2xl font-bold text-blue-600',
};

// 녹색 테마
const greenTheme = {
  modalBackground: 'bg-green-900/70',
  modalContainer: 'bg-gradient-to-b from-green-50 to-green-100',
  questionText: 'text-5xl font-bold text-center text-green-900',
  headerText: 'text-2xl font-bold text-green-700',
  timerText: 'text-2xl font-bold text-green-600',
};
```

## 고급 사용법

### 동적 퀴즈 생성

```tsx
const generateRandomMathQuiz = (): QuizData => {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  const answer = a + b;
  
  return createMultipleChoiceQuiz(
    `math-${a}-${b}`,
    `What is ${a} + ${b}?`,
    answer.toString(),
    [
      (answer + 1).toString(),
      (answer - 1).toString(),
      (answer + 2).toString()
    ]
  );
};
```

### 퀴즈 시퀀스 관리

```tsx
const QuizSequence: React.FC = () => {
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizzes] = useState<QuizData[]>([
    generateRandomMathQuiz(),
    generateRandomMathQuiz(),
    generateRandomMathQuiz()
  ]);

  const handleAnswer = (isCorrect: boolean, selectedOptionText: string) => {
    if (quizIndex < quizzes.length - 1) {
      setQuizIndex(prev => prev + 1);
    } else {
      // 모든 퀴즈 완료
      console.log('All quizzes completed!');
    }
  };

  return (
    <QuizPopup
      quiz={quizzes[quizIndex]}
      team="A"
      onAnswer={handleAnswer}
      isPaused={false}
    />
  );
};
```

## 주의사항

1. **퀴즈 데이터 검증**: `options` 배열에 정확히 하나의 `isCorrect: true` 옵션이 있는지 확인하세요.

2. **이미지 경로**: `stimulus.imageUrl`은 public 폴더 기준의 경로를 사용하세요.

3. **타이머 관리**: `isPaused`가 true일 때 타이머가 일시정지됩니다.

4. **메모리 관리**: 컴포넌트가 언마운트될 때 타이머가 자동으로 정리됩니다.

5. **접근성**: 스크린 리더를 위한 alt 텍스트가 이미지에 포함되어 있습니다.

## 의존성

- React 18+
- Tailwind CSS
- TypeScript (선택사항)

## 라이선스

MIT License
