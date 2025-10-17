# QuizPopup - 재사용 가능한 퀴즈 컴포넌트

## 개요

`QuizPopup`은 다양한 게임에서 사용할 수 있는 유연하고 재사용 가능한 퀴즈 컴포넌트입니다. 객관식 퀴즈를 지원하며, 이미지와 문장 완성 문제도 처리할 수 있습니다.

## 주요 특징

- ✅ **완전한 커스터마이징**: 색상, 스타일, 타이머 등 모든 요소를 커스터마이징 가능
- ✅ **다양한 퀴즈 타입**: 텍스트, 이미지, 문장 완성 퀴즈 지원
- ✅ **타이머 기능**: 설정 가능한 제한 시간과 자동 종료
- ✅ **팀 시스템**: 팀별 색상과 이름 표시
- ✅ **피드백 시스템**: 정답/오답 피드백과 사운드 효과
- ✅ **TypeScript 지원**: 완전한 타입 안전성
- ✅ **반응형 디자인**: 모든 화면 크기에서 최적화

## 빠른 시작

```tsx
import { QuizPopup, QuizData } from './reference';

const MyGame: React.FC = () => {
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
      isPaused={false}
    />
  );
};
```

## 설치 및 사용

### 1. 파일 복사

다음 파일들을 프로젝트에 복사하세요:

```
reference/
├── QuizPopup.tsx              # 메인 컴포넌트
├── QuizPopupExamples.tsx      # 사용 예제 및 유틸리티
├── QuizPopupUsageGuide.md     # 상세 사용 가이드
└── index.ts                   # 모든 exports
```

### 2. 의존성 설치

```bash
npm install react tailwindcss
```

### 3. Tailwind CSS 설정

`tailwind.config.js`에 다음 애니메이션을 추가하세요:

```javascript
module.exports = {
  // ... 기존 설정
  theme: {
    extend: {
      animation: {
        'pop-in': 'popIn 0.3s ease-out',
        'pop-in-large': 'popInLarge 0.5s ease-out',
      },
      keyframes: {
        popIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        popInLarge: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
}
```

## 사용 예제

### 기본 퀴즈

```tsx
import { QuizPopup, createMultipleChoiceQuiz } from './reference';

const BasicQuiz = () => {
  const quiz = createMultipleChoiceQuiz(
    'math-1',
    'What is 2 + 2?',
    '4',
    ['3', '5', '6']
  );

  return (
    <QuizPopup
      quiz={quiz}
      team="A"
      onAnswer={(isCorrect) => console.log(isCorrect)}
      isPaused={false}
    />
  );
};
```

### 커스텀 스타일 퀴즈

```tsx
const CustomQuiz = () => {
  const customStyles = {
    modalBackground: 'bg-blue-900/70',
    modalContainer: 'bg-gradient-to-b from-yellow-50 to-orange-50',
    questionText: 'text-6xl font-bold text-center text-blue-900',
  };

  return (
    <QuizPopup
      quiz={quiz}
      team="A"
      onAnswer={handleAnswer}
      isPaused={false}
      customStyles={customStyles}
      timeLimit={15}
    />
  );
};
```

### 이미지 퀴즈

```tsx
const ImageQuiz = () => {
  const imageQuiz: QuizData = {
    quizId: 'image-1',
    quizType: 'multipleChoice',
    questionText: 'What is shown in this image?',
    options: [
      { text: 'Mountain', isCorrect: false },
      { text: 'Ocean', isCorrect: true },
      { text: 'Forest', isCorrect: false }
    ],
    stimulus: {
      imageUrl: '/images/ocean.jpg'
    }
  };

  return (
    <QuizPopup
      quiz={imageQuiz}
      team="A"
      onAnswer={handleAnswer}
      isPaused={false}
    />
  );
};
```

## Props API

### 필수 Props

| Prop | Type | 설명 |
|------|------|------|
| `quiz` | `QuizData` | 퀴즈 데이터 |
| `team` | `'A' \| 'B'` | 팀 식별자 |
| `onAnswer` | `(isCorrect: boolean, selectedOptionText: string) => void` | 답변 콜백 |
| `isPaused` | `boolean` | 일시정지 상태 |

### 선택적 Props

| Prop | Type | 기본값 | 설명 |
|------|------|--------|------|
| `timeLimit` | `number` | `10` | 제한 시간 (초) |
| `teamColors` | `TeamColors` | 기본값 | 팀 색상 |
| `customStyles` | `CustomStyles` | 기본값 | 커스텀 스타일 |
| `showTimer` | `boolean` | `true` | 타이머 표시 |
| `showTeamName` | `boolean` | `true` | 팀명 표시 |
| `feedbackDuration` | `number` | `1500` | 피드백 시간 (ms) |
| `exitDelay` | `number` | `500` | 종료 지연 (ms) |

## 유틸리티 함수

### 퀴즈 생성

```tsx
import { createQuiz, createMultipleChoiceQuiz, QUIZ_PRESETS } from './reference';

// 기본 퀴즈 생성
const quiz = createQuiz('id', 'question', options);

// 객관식 퀴즈 생성 (자동 섞기)
const quiz2 = createMultipleChoiceQuiz('id', 'question', 'correct', ['wrong1', 'wrong2']);

// 프리셋 사용
const mathQuiz = QUIZ_PRESETS.math.createAdditionQuiz(5, 3);
const vocabQuiz = QUIZ_PRESETS.vocabulary.createDefinitionQuiz('happy', 'joyful', ['sad', 'angry']);
```

## 게임 통합

### 점수 시스템

```tsx
const GameWithScore = () => {
  const [score, setScore] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore(prev => prev + 10);
    setCurrentQuiz(null);
  };

  return (
    <div>
      <h1>Score: {score}</h1>
      {currentQuiz && (
        <QuizPopup
          quiz={currentQuiz}
          team="A"
          onAnswer={handleAnswer}
          isPaused={false}
        />
      )}
    </div>
  );
};
```

### 팀별 게임

```tsx
const TeamGame = () => {
  const [teamScores, setTeamScores] = useState({ A: 0, B: 0 });
  const [currentTeam, setCurrentTeam] = useState<'A' | 'B'>('A');

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setTeamScores(prev => ({
        ...prev,
        [currentTeam]: prev[currentTeam] + 1
      }));
    }
    setCurrentTeam(prev => prev === 'A' ? 'B' : 'A');
  };

  return (
    <div>
      <div>Team A: {teamScores.A}</div>
      <div>Team B: {teamScores.B}</div>
      <QuizPopup
        quiz={quiz}
        team={currentTeam}
        onAnswer={handleAnswer}
        isPaused={false}
      />
    </div>
  );
};
```

## 커스터마이징

### 색상 테마

```tsx
const themes = {
  blue: {
    modalBackground: 'bg-blue-900/70',
    modalContainer: 'bg-gradient-to-b from-blue-50 to-blue-100',
    questionText: 'text-5xl font-bold text-center text-blue-900',
  },
  green: {
    modalBackground: 'bg-green-900/70',
    modalContainer: 'bg-gradient-to-b from-green-50 to-green-100',
    questionText: 'text-5xl font-bold text-center text-green-900',
  }
};
```

### 팀 색상

```tsx
const customTeamColors = {
  A: { name: 'text-blue-600', line: 'bg-blue-600' },
  B: { name: 'text-orange-600', line: 'bg-orange-600' },
};
```

## 파일 구조

```
reference/
├── QuizPopup.tsx              # 메인 컴포넌트
├── QuizPopupExamples.tsx      # 예제 및 유틸리티
├── QuizPopupUsageGuide.md     # 상세 가이드
└── index.ts                   # 모든 exports
```

## 브라우저 지원

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 라이선스

MIT License

## 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 지원

문제가 있거나 기능 요청이 있으시면 GitHub Issues를 통해 알려주세요.
